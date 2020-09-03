import React from "react";
import { Round, onRoundReport, onDeleteRound } from "./Matches"

export class TopCuts extends React.Component {
    state = {
        error: ""
    }

    newRound(people) {
        return Array
            .from(people)
            .reduce((result, value, index, array) => {
                if (index % 2 === 0) {
                    result.push(array.slice(index, index + 2));
                }
                return result;
            }, [])
            .map(x => {
                return [
                    {
                        player: this.props.players[x[0]],
                        score: 0
                    },
                    {
                        player: this.props.players[x[1]],
                        score: 0
                    }
                ]
            });
    }

    checkPowerOfTwo(x) {
        while (x > 2) {
            x = x / 2;
        }

        return x === 2
    }

    firstRoundPairings(cuts) {
        let new_cuts = cuts.reduce((result, value, index, array) => {
            if (index < array.length / 2) {
                result.push([array[index], array[array.length - index - 1]]);
            }
            return result;
        }, []);

        let front = [];
        let back = [];

        while (new_cuts.length > 0) {
            front.push(new_cuts.shift());
            back.push(new_cuts.shift());
        }

        return [...front, ...back.reverse()].flat();
    }

    onNextRound() {
        if (this.props.topcut_rounds.length === 0) {
            if (this.checkPowerOfTwo(this.props.topcuts.length)) {
                this.props.newState({topcut_rounds: [this.newRound(this.firstRoundPairings(this.props.topcuts))]});
            } else {
                this.setState({error: "Number of selected players must be a power of 2."})
            }
        } else {
            let next = this.props.topcut_rounds[this.props.topcut_rounds.length - 1]
                .map(x => {
                    if (x[0].score !== 0) {
                        return x[0].player.key;
                    }
                    return x[1].player.key;
                });

            if (next.length !== 1) {
                this.props.newState({topcut_rounds: [...this.props.topcut_rounds, this.newRound(next)]});
            } else {
                this.setState({error: `${this.props.players[next[0]].name} is the winner!!`});
            }
        }
    }

    render() {
        let matches = this.props.topcut_rounds.map(
            (x, index) => {
                return <Round
                    onReport={(event) => onRoundReport(event, this.props.topcut_rounds, this.props.newState, "topcut_rounds")}
                    iden={index}
                    matches={x}
                    key={index}
                    hidetie={true}
                />
            }
        );

        return (
            <div>
                <h1>Elimination Matches</h1>
                <div className="buttons">
                    <button onClick={this.onNextRound.bind(this)}>New Round</button>
                    <button onClick={() => onDeleteRound(this.props.topcut_rounds, this.props.newState, "topcut_rounds")}>Delete Round</button>
                </div>
                <div className="wrapper">
                    <div className="matches">
                        {matches}
                    </div>
                </div>
                <p className="error">{this.state.error}</p>

            </div>
        );
    }
}