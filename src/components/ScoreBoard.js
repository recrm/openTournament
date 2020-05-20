import React from "react";

export const ScoreBoard = (props) => {
    let rows = props.players.slice(0)
        .sort((a,b) => {return a.sort(b, props.players, props.matches)})
        .map((player, i) => {
            return (
                <tr key={i}>
                    <td>{player.name}</td>
                    <td>{player.score(props.matches)}</td>
                    <td>{player.sos(props.players, props.matches)}</td>
                    <td>{player.city}</td>
                    <td>{player.character}</td>
                </tr>
            );
        });

    return (
        <table className="scoreboard">
            <thead>
                <tr>
                    <td>name</td>
                    <td>result</td>
                    <td>sos</td>
                    <td>city</td>
                    <td>character</td>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}