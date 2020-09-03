import React from "react";
import { player, by_player } from "./Player";

export const PlayerEntry = (props) => {
    let rows = props.players.map((player, i) => {
        return (
            <tr key={i}>
                <td><input name="name" value={player.name} onChange={player.handleChange} /></td>
                <td><input name="city" value={player.city} onChange={player.handleChange} /></td>
                <td><input name="character" value={player.character} onChange={player.handleChange} /></td>
                <td><input name="seed" value={player.seed} onChange={player.handleChange} /></td>
            </tr>
        );
    });

    return (
        <div>
            <h1>Player Entry</h1>
            <div className="buttons">
                <button
                    disabled={props.players.length >= 128}
                    onClick={() => onNewPlayer(props.players, props.rounds, props.newState)}>Add Player</button>
                <button
                    disabled={props.rounds.length > 0 || props.players.length <= 1}
                    onClick={() => onDeletePlayer(props.players, props.topcuts, props.newState)}>Remove Player</button>
                <input
                    disabled={props.rounds.length > 0}
                    value={props.players.length}
                    onChange={(value) => onSetPlayer(value, props.players, props.rounds, props.topcuts, props.newState)}
                    className="num-players"
                    size="1"
                    />
            </div>

            <div className="wrapper">
                <form >
                    <table className="scoreboard">
                        <thead className="test">
                            <tr>
                                <td>Name</td>
                                <td>City</td>
                                <td>Character</td>
                                <td>Seed</td>
                            </tr>
                        </thead>

                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    );
}

function onSetPlayer(obj, players, rounds, topcuts, newState) {
    let value = obj.target.value;
    if (value > 128) {
        value = 128
    }

    while (value > players.length) {
        onNewPlayer(players, rounds, newState);
    }

    while (value < players.length) {
        onDeletePlayer(players, topcuts, newState);
    }
}

function onDeletePlayer(players, topcuts, newState) {
    let gone = players.pop();

    if (topcuts.includes(gone.key)) {
        topcuts = topcuts.filter(key => key !== gone.key);
    }

    newState({players, topcuts});
}

function onNewPlayer(players, rounds, newState) {
    // Create Player
    let new_player = player(
        players.length,
        () => newState({players: players})
    );
    players.push(new_player);

    // Add player into any existing rounds
    rounds.forEach((current, index, array) => {
        current.push([
            {score: 0, player: new_player},
            {score: 0, player: by_player}
        ]);
    });

    // Update react
    newState({players: players});

}