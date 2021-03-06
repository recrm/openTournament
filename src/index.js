import React from "react";
import { render } from "react-dom";
import { PlayerEntry } from "./components/PlayerEntry";
import { MatchesManager } from "./components/Matches";
import { DataManager, DataOutput, save_local, load_local, new_local } from "./components/Data";
import { Navigation } from "./components/Navigation"
import { ScoreBoard } from "./components/ScoreBoard";
import { TopCut } from "./components/TopCut";

// TODO: Add google analytics
import ReactGA from 'react-ga';
const trackingId = "UA-21714436-2"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(
    
    trackingId
);

class Wrapper extends React.Component {

    state = {
        page: "enter",
        players: [],
        rounds: [],
        topcut: [],
        topcut_rounds: [],
    }

    newState(obj) {
        this.setState(obj, () => save_local(this.state));
    }

    componentDidMount() {

        try {
            let data = load_local(this.newState.bind(this));
            if (data != null) {
                delete data.name;
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
            ReactGA.pageview("data_export");
            page = <DataOutput
                       state={this.state}
                   />
        } else if (this.state.page === "scores") {
            ReactGA.pageview("scores");
            page = <ScoreBoard
                       players={this.state.players}
                       rounds={this.state.rounds}
                       topcut={this.state.topcut}
                       newState={newState}
                    />
        } else if (this.state.page === "enter") {
            ReactGA.pageview("data_load");
            page = <DataManager
                       newState={newState}
                   />
        } else if (this.state.page === "players") {
            ReactGA.pageview("player_entry");
            page = <PlayerEntry
                       players={this.state.players}
                       rounds={this.state.rounds}
                       topcut={this.state.topcut}
                       topcut_rounds={this.state.topcut_rounds}
                       newState={newState}
                   />
        } else if (this.state.page === "matches") {
            ReactGA.pageview("swiss_matches");
            page = <MatchesManager
                       players={this.state.players}
                       rounds={this.state.rounds}
                       newState={newState}
                    />
        } else if (this.state.page === "topcut") {
            ReactGA.pageview("elimination_matches");
            page = <TopCut
                       players={this.state.players}
                       topcut={this.state.topcut}
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
        // TODO: add ability to add cards.
    }
}

render(<Wrapper />, window.document.getElementById("app"));

