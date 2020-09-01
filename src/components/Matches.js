import React from "react";
import { ScoreBoard } from "./ScoreBoard";

const Match = (props) => {
    return (
        <tr key={props.name}>
            <td>{props.xname}</td>
            <td><input type="radio" value={props.xkey} name={props.name} onChange={props.onReport} checked={props.checked === props.xkey} /></td>
            <td><input type="radio" value="tie" name={props.name} onChange={props.onReport} checked={props.checked === "tie"} /></td>
            <td><input type="radio" value={props.ykey} name={props.name} onChange={props.onReport} checked={props.checked === props.ykey} /></td>
            <td>{props.yname}</td>
        </tr>
    )
}

export const Matches = (props) => {

    let matches = props.matches.map((x, index) => {
        let name = `${props.iden}-${index}`;

        let checked;
        if (x[0].score === props.win) {
            checked = x[0].player.key;
        } else if (x[1].score === props.win) {
            checked = x[1].player.key;
        } else if (x[0].score === props.tie) {
            checked = "tie";
        } else {
            checked = "noop";
        }

        return <Match
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
            <h2>Round {props.iden}</h2>
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
        (x, index) => <Matches
           onReport={props.onRoundReport.bind(this)}
           iden={index}
           matches={x}
           key={index}
           win={props.win}
           tie={props.tie}
        />
    );

    return (
        <div>
            <div>
                <h1>Matches</h1>
                <div className="buttons">
                    <div>
                        <button onClick={props.onNewRound.bind(this)}>New Round</button>
                        <button onClick={props.onDeleteRound.bind(this)}>Delete Round</button>
                    </div>
                </div>
                <div className="matches">
                    {matches}
                </div>
            </div>
        </div>
    )
}