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
        <div className="form-players">
            <form>
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
            <div className="player-buttons">
                <button onClick={props.player_add}>Add New Player</button>
                <button disabled={props.matches.length > 0} onClick={props.player_remove}>Remove Player</button>
                <button onClick={props.start}>Matches</button>
                <input disabled={props.matches.length > 0} value={props.players.length} onChange={props.player_set} />
            </div>
        </div>
    );
}