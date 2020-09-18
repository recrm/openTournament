import React from "react";
import { by_player } from "./Player";

export const win = 3;
export const tie = 1;
export const lose = 0;

const Match = (props) => {
    return (
        <tr key={props.name}>
            <td>{props.xname}</td>
            <td><input type="radio" value={props.xkey} name={props.name} onChange={props.onReport} checked={props.checked === props.xkey} key={1} /></td>
            <td><input type="radio" value="tie" name={props.name} onChange={props.onReport} checked={props.checked === "tie"} key={2} hidden={props.hidetie} /></td>
            <td><input type="radio" value={props.ykey} name={props.name} onChange={props.onReport} checked={props.checked === props.ykey} key={3} /></td>
            <td>{props.yname}</td>
        </tr>
    )
}

export const Round = (props) => {

    let matches = props.matches.map((x, index) => {
        let name = `${props.iden}-${index}`;

        let checked;
        if (x[0].score === win) {
            checked = x[0].player.key;
        } else if (x[1].score === win) {
            checked = x[1].player.key;
        } else if (x[0].score === tie) {
            checked = "tie";
        } else {
            checked = "noop";
        }

        return <Match
                   hidetie={props.hidetie}
                   checked={checked}
                   name={name}
                   key={index}
                   xkey={x[0].player.key}
                   ykey={x[1].player.key}
                   xname={x[0].player.name}
                   yname={x[1].player.name}
                   onReport={props.onReport}
                />
    });

    return (
        <div className="round">
            <h2>Round {props.iden + 1}</h2>
            <hr />
            <table>
                <tbody>
                    {matches}
                </tbody>
            </table>
        </div>
    );
}

export const MatchesManager = (props) => {
    let matches = props.rounds.map(
        (x, index) => <Round
            hidetie={false}
            onReport={(event) => onRoundReport(event, props.rounds, props.newState, "rounds")}
            iden={index}
            matches={x}
            key={index}
        />
    );

    return (
        <div>
            <h1>Swiss Matches</h1>
            <div className="buttons">
                <button onClick={() => onNewRound(props.players, props.rounds, props.newState)}>New Round</button>
                <button onClick={() => onDeleteRound(props.rounds, props.newState, "rounds")}>Delete Round</button>
            </div>
            <div className="wrapper">
                <div className="matches">
                    {matches}
                </div>
            </div>
        </div>
    )
}

function pairing(candidates, rounds) {

    if (candidates.length === 0) {
        return [];
    }

    const node = candidates.shift();
    let opponents = node.opponents(rounds);

    return candidates
        .filter(x => !opponents.includes(x.key))
        .reduce((prev, child) => {
            if (prev !== undefined) {
                return prev;
            }

            let spliced = candidates.slice(0);
            spliced.splice(spliced.indexOf(child), 1);

            let matches = pairing(spliced, rounds);
            if (matches !== undefined) {
                matches.push([
                    {score: child.key === -1 ? win : lose, player: node},
                    {score: node.key === -1 ? win : lose, player: child},
                ]);
            }
            return matches;
        }, undefined);
}

function onNewRound(players, rounds, newState) {
    if (players.length === 0) {
        return;
    }

    let candidates = players
        .slice(0)
        .sort((a,b) => a.sort(b, players, rounds));

    if (candidates.length % 2 === 1) {
        candidates.push(by_player);
    }

    let matches = pairing(candidates.slice(0), rounds);

    if (matches !== undefined) {
        matches.reverse();
        rounds.push(matches);
        newState({rounds});
    }
}

export function onDeleteRound(rounds, newState, name) {
    rounds.pop();
    newState({name: rounds});
}

export function onRoundReport(event, rounds, newState, name) {
    let round_winner = event.target.value;
    let split = event.target.name.split("-");
    let current_match = rounds[parseInt(split[0])][parseInt(split[1])];

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

    newState({[name]: rounds});
}