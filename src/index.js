import React from "react";
import { render } from "react-dom";
import { PlayerEntry } from "./components/PlayerEntry";
import { player, restorePlayer } from "./components/Player";
import { Matches } from "./components/Matches";
import { ScoreBoard } from "./components/ScoreBoard";
import ls from "local-storage";

let by_player = player(-1);
by_player.name = "BY";

class Wrapper extends React.Component {

    state = {
        win: 3,
        lose: 0,
        tie: 1,
        page: "enter",
        players: [],
        rounds: [],
    }

    onSetPlayer(value, update) {
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
                player.score = this.state.tie;
            });
        } else {
            current_match.forEach((player) => {
                player.score = player.player.key === parseInt(round_winner)
                    ? this.state.win
                    : this.state.lose;
            });
        }

        this.newState({rounds: this.state.rounds});
    }

    newState(obj) {
        this.setState(obj, () => ls.set("ak-rc_games", JSON.stringify(this.state)));
    }

    onReloadState() {
        let data = ls.get("ak-rc_games");
        if (data !== null) {
            let new_state = JSON.parse(data);

            // Restore player objects
            new_state.players.forEach(x => restorePlayer(x, () => this.onUpdatePlayer(this.state.players)));

            // Restore match objects
            new_state.rounds.forEach(round => {
                round.forEach(match => {
                    match.forEach(player => {
                        player.player = player.player.key === -1
                            ? by_player
                            : new_state.players[player.player.key];
                    });
                });
            });
            this.newState(new_state);
        }
    }

    componentDidMount() {
        this.onSetPlayer(4, false);
    }

    render() {
        if (this.state.page === "enter") {
            return (
                <div>
                    <button onClick={() => this.onChangePage("players")}>New Event</button>
                    <button onClick={this.onReloadState.bind(this)}>Reload Previous Data</button>
                </div>
            )
        } else if (this.state.page === "players") {
            return <PlayerEntry
                       start={() => this.onChangePage("matches")}
                       players={this.state.players}
                       matches={this.state.rounds}
                       player_add={() => this.onNewPlayer()}
                       player_remove={() => this.onDeletePlayer()}
                       player_set={(event) => this.onSetPlayer(event.target.value)}
                   />

        } else if (this.state.page === "matches") {
            let matches = this.state.rounds.map((x, index) => <Matches
                                                           onReport={this.onRoundReport.bind(this)}
                                                           iden={index}
                                                           matches={x}
                                                           key={index}
                                                           win={this.state.win}
                                                           tie={this.state.tie}
                                                        />);

            return (
                <div className="main">
                    <div>
                        <div className="buttons">
                            <h1>Matches</h1>
                            <div>
                                <button onClick={this.onNewRound.bind(this)}>New Round</button>
                                <button onClick={this.onDeleteRound.bind(this)}>Delete Round</button>
                                <button onClick={() => this.onChangePage("players")}>Edit people</button>
                            </div>
                        </div>
                        <div className="matches">
                            {matches}
                        </div>
                    </div>
                    <div className="scores">
                        <h1>Scores</h1>
                        <ScoreBoard players={this.state.players} matches={this.state.rounds} />
                    </div>
                </div>
            )
        }
    }
}

render(<Wrapper />, window.document.getElementById("app"));

