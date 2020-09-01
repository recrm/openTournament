import React from "react";
import { render } from "react-dom";
import { PlayerEntry } from "./components/PlayerEntry";
import { player, restorePlayer } from "./components/Player";
import { MatchesManager } from "./components/Matches";
import { DataManager, DataOutput, save_local } from "./components/Data";
import { Navigation } from "./components/Navigation"
import { ScoreBoard } from "./components/ScoreBoard";

let by_player = player(-1);
by_player.name = "BY";

const win = 3;
const tie = 1;
const lose = 0;

class Wrapper extends React.Component {

    state = {
        page: "enter",
        players: [],
        rounds: [],
    }

    onSetPlayer(value, update) {
        if (value > 128) {
            value = 128
        }

        while (value > this.state.players.length) {
            this.onNewPlayer(update);
        }

        while (value < this.state.players.length) {
            this.onDeletePlayer(update);
        }
    }

    onNewPlayer(update) {
        // Create Player
        let new_player = player(
            this.state.players.length,
            () => this.onUpdatePlayer(this.state.players)
        );
        this.state.players.push(new_player);

        // Add player into any existing rounds
        this.state.rounds.forEach((current, index, array) => {
            current.push([
                {score: 0, player: new_player},
                {score: 0, player: by_player}
            ]);
        });

        // Update react
        if (update === undefined) {
            this.newState({players: this.state.players});
        }
    }

    onDeletePlayer(update) {
        this.state.players.pop();
        if (update === undefined) {
            this.newState({players: this.state.players});
        }
    }

    pairing(candidates) {

        if (candidates.length === 0) {
            return [];
        }

        const node = candidates.shift();
        let opponents = node.opponents(this.state.rounds);

        return candidates
            .filter(x => !opponents.includes(x.key))
            .reduce((prev, child) => {
                if (prev !== undefined) {
                    return prev;
                }

                let spliced = candidates.slice(0);
                spliced.splice(spliced.indexOf(child), 1);

                let matches = this.pairing(spliced);
                if (matches !== undefined) {
                    matches.push([
                        {score: 0, player: node},
                        {score: 0, player: child},
                    ]);
                }
                return matches;
            }, undefined);
    }

    onNewRound() {
        let candidates = this.state.players
            .slice(0)
            .sort((a,b) => a.sort(b, this.state.players, this.state.rounds));

        if (candidates.length % 2 === 1) {
            candidates.push(by_player);
        }

        let matches = this.pairing(candidates.slice(0));

        if (matches !== undefined) {
            matches.reverse();
            this.state.rounds.push(matches);
            this.newState({rounds: this.state.rounds});
        }
    }

    onDeleteRound() {
        this.state.rounds.pop();
        this.newState({rounds: this.state.rounds});
    }

    onUpdatePlayer(players) {
        this.newState({players: players});
    }

    onChangePage(page) {
        this.newState({page: page});
    }

    onRoundReport(event) {
        let round_winner = event.target.value;
        let split = event.target.name.split("-");
        let current_match = this.state.rounds[parseInt(split[0])][parseInt(split[1])];

        if (round_winner === "tie") {
            current_match.forEach((player) => {
                player.score = tie;
            });
        } else {
            current_match.forEach((player) => {
                player.score = player.player.key === parseInt(round_winner)
                    ? win
                    : lose;
            });
        }

        this.newState({rounds: this.state.rounds});
    }

    newState(obj) {
        this.setState(obj, () => save_local(this.state));
    }

    onReloadState(new_state) {
        // Restore player objects
        new_state.players.forEach(x => restorePlayer(x, () => this.onUpdatePlayer(this.state.players)));

        // Restore match objects
        new_state.rounds.forEach(round => {
            round.forEach(match => {
                match.forEach(player => {
                    player.player = player.player === -1
                        ? by_player
                        : new_state.players[player.player];
                });
            });
        });

        new_state.page = "matches";

        this.newState(new_state);
    }

    componentDidMount() {
        this.onSetPlayer(4, false);
    }

    render() {
        let page;

        if (this.state.page === "data") {
            page = <DataOutput
                       state={this.state}
                   />
        } else if (this.state.page === "scores") {
            page = <ScoreBoard
                       players={this.state.players}
                       matches={this.state.rounds}
                    />
        } else if (this.state.page === "enter") {
            page = <DataManager
                       onReloadState={this.onReloadState.bind(this)}
                   />
        } else if (this.state.page === "players") {
            page = <PlayerEntry
                       players={this.state.players}
                       matches={this.state.rounds}
                       player_add={() => this.onNewPlayer()}
                       player_remove={() => this.onDeletePlayer()}
                       player_set={(event) => this.onSetPlayer(event.target.value)}
                   />

        } else if (this.state.page === "matches") {
            page = <MatchesManager
                       win={win}
                       tie={tie}
                       rounds={this.state.rounds}
                       players={this.state.players}
                       onRoundReport={this.onRoundReport.bind(this)}
                       onNewRound={this.onNewRound.bind(this)}
                       onDeleteRound={this.onDeleteRound.bind(this)}
                    />
        }

        return (
            <div className="fill">
                <Navigation onChangePage={this.onChangePage.bind(this)} />
                {page}
            </div>
        )
    }
}

render(<Wrapper />, window.document.getElementById("app"));

