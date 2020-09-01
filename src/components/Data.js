import React from "react";
import ls from "local-storage";

export class DataManager extends React.Component {
    state = {
        raw: "",
        error: "",
    }

    getFromLocal() {
        let data = ls.get("ak-rc_games");
        if (data !== null) {
            let new_state = JSON.parse(data);
            expand(new_state);
            console.log(new_state);
            this.props.onReloadState(new_state);
        }
    }

    getFromText() {
        let new_state
        try {
            new_state = JSON.parse(this.state.raw);
            expand(new_state);
            this.props.onReloadState(new_state);
        } catch(SyntaxError) {
            this.setState({error: "Failed to load data"});
        }
    }

    onChangeData(event) {
        this.setState({raw: event.target.value});
    }

    render() {
        return (
            <div>
                <h1>Load Data</h1>
                <div className="buttons">
                    <button onClick={this.getFromLocal.bind(this)}>Reload Previous Data</button>
                    <button onClick={this.getFromText.bind(this)}>Import From Textbox</button>
                </div>
                <div>
                    <textarea onChange={this.onChangeData.bind(this)}></textarea>
                    <p>{this.state.error}</p>
                </div>
            </div>
        )
    }
}

function get_json(obj) {
    let copy = JSON.parse(JSON.stringify(obj));
    copy.rounds.forEach(round => {
        round.forEach((match, index, theArray) => {
            theArray[index] = {
                key1: match[0].player.key,
                key2: match[1].player.key,
                score1: match[0].score,
                score2: match[1].score,
            }
        })
    });
    delete copy.page;
    return copy;
}

function expand(obj) {
    obj.rounds.forEach(round => {
        round.forEach((match, index, theArray) => {
            theArray[index] = [
                {
                    player: match.key1,
                    score: match.score1,
                },
                {
                    player: match.key2,
                    score: match.score2,
                }
            ];
        })
    })
}


export function save_local(obj) {
    let data = get_json(obj);
    ls.set("ak-rc_games", JSON.stringify(data));
}

export const DataOutput = (props) => {
    let data = JSON.stringify(get_json(props.state), undefined, 4);
    return (
        <div>
            <h1>Export Data</h1>
            <textarea value={data} readOnly></textarea>
        </div>
    );
}