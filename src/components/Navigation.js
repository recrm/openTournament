import React from "react";
import { Timer } from "./Timer";

export const Navigation = (props) => {
    return (
        <div className="header">
            <div className="buttons">
                <img className="logo" src={"logo.png"} />
                <button onClick={() => props.onChangePage("players")}>People</button>
                <button onClick={() => props.onChangePage("matches")}>Matches</button>
                <button onClick={() => props.onChangePage("scores")}>Scores</button>
                <button onClick={() => props.onChangePage("data")}>Export</button>
                <button onClick={() => props.onChangePage("enter")}>Load</button>
            </div>
            <div className="attribution">
                <p>Programmed by Ryan Chartier</p>
                <p>Please report bugs on <a href="https://github.com/recrm/openTournament">github</a></p>
            </div>
            <Timer />
        </div>
    );
}