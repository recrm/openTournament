import React from "react";
import { render } from "react-dom";
import { PlayerEntry } from "./components/PlayerEntry";
import { MatchesManager } from "./components/Matches";
import { DataManager, DataOutput, save_local, load_local, new_local } from "./components/Data";
import { Navigation } from "./components/Navigation"
import { ScoreBoard } from "./components/ScoreBoard";
import { TopCuts } from "./components/TopCuts";

class Wrapper extends React.Component {

    state = {
        page: "enter",
        players: [],
        rounds: [],
        topcuts: [],
        topcut_rounds: [],
    }

    newState(obj) {
        this.setState(obj, () => save_local(this.state));
    }

    componentDidMount() {
        try {
            let data = load_local(this.newState.bind(this));
            if (data != null) {
                this.newState(data);
                this.newState({page: "enter"});
                return;
            }
        } catch {}
        this.newState(new_local());
        this.newState({page: "enter"});
    }

    render() {
        let page;
        let newState = this.newState.bind(this);

        if (this.state.page === "data") {
            page = <DataOutput
                       state={this.state}
                   />
        } else if (this.state.page === "scores") {
            page = <ScoreBoard
                       players={this.state.players}
                       rounds={this.state.rounds}
                       topcuts={this.state.topcuts}
                       newState={newState}
                    />
        } else if (this.state.page === "enter") {
            page = <DataManager
                       newState={newState}
                   />
        } else if (this.state.page === "players") {
            page = <PlayerEntry
                       players={this.state.players}
                       rounds={this.state.rounds}
                       topcuts={this.state.topcuts}
                       newState={newState}
                   />
        } else if (this.state.page === "matches") {
            page = <MatchesManager
                       players={this.state.players}
                       rounds={this.state.rounds}
                       newState={newState}
                    />
        } else if (this.state.page === "topcuts") {
            page = <TopCuts
                       players={this.state.players}
                       topcuts={this.state.topcuts}
                       topcut_rounds={this.state.topcut_rounds}
                       newState={newState}
                    />
        }
        return (
            <div className="fill">
                <Navigation newState={newState} />
                {page}
            </div>
        )
    }
}

render(<Wrapper />, window.document.getElementById("app"));

