import React from "react";

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
            <div >
                <div className="buttons">
                    <button
                        disabled={props.players.length >= 128}
                        onClick={props.player_add}>Add New Player</button>
                    <button
                        disabled={props.matches.length > 0 || props.players.length <= 1}
                        onClick={props.player_remove}>Remove Player</button>
                    <input
                        disabled={props.matches.length > 0}
                        value={props.players.length}
                        onChange={props.player_set}
                        className="num-players"
                        size="1"
                        />
                </div>

                <form className="form-players">
                    <table>
                        <thead>
                            <tr>
                                <td>name</td>
                                <td>city</td>
                                <td>character</td>
                                <td>seed</td>
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