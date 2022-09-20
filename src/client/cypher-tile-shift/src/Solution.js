import React from 'react'
import {Box} from 'rebass'
import './App.css'

class Solution extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            winMessages: ["You did it!", "Great!", "Nice job!", "Good work!"],
            winWinMessages: ["You solved the puzzle, it revealed some interesting information...",
                "Puzzle solved, time to see what's really going on...", "Nice job! Now to learn the truth...",
                "Ah ha! So that's what's going on..."],
            currentWinMessage: 0,
            numberToComplete: 3,
        }
    }

    continue() {
        this.props.onContinue()
    }

    onComponentDidMount() {
        let winMessageIdx = Math.floor(Math.random() * 4);
        this.setState({currentWinMessage: winMessageIdx});
    }

    itemHasValue(key) {
        return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
    }

    updateScore() {
        let url = this.itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
        url = "http://" + url + ":3000"
        fetch(url + '/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: 2,
                progress: this.props.gamesWon,
            })
        })
    }

    render() {
        this.updateScore()
        // this.state.numberToComplete--;
        // console.log("complete this " + this.state.numberToComplete)
        // console.log(this.state.mode)
        // this.state.mode = 'intro'
        console.log(this.props.gamesLeft);
        if (this.props.gamesLeft > 0) {
            return (
                <Box
                    sx={{
                        display: 'grid',
                        gridGap: 0
                    }}>
                    {/*<Box><div className="non-interact"></div></Box>*/}
                    <Box>
                        <div id="win-message">
                            <p className="win-lose-start center">{this.state.winMessages[this.state.currentWinMessage]}</p>
                            <p className="win-lose-result center"></p>
                            <button className="restart center" onClick={() => {
                                this.continue()
                            }}>Continue
                            </button>
                        </div>
                    </Box>
                </Box>
            );
        } else {
            return (
                <Box
                    sx={{
                        display: 'grid',
                        gridGap: 0
                    }}>
                    {/*<Box><div className="non-interact"></div></Box>*/}
                    <Box>
                        <div id="win-message">
                            <p className="win-lose-start center">{this.state.winWinMessages[this.state.currentWinMessage]}</p>
                            <p className="win-lose-result center"></p>
                            <button className="center restart" onClick={() => {
                                document.location.reload()
                            }}>Restart
                            </button>
                            {/*<img className="dice" src={dice} alt="Echo Games' dice"/>*/}
                        </div>
                    </Box>
                </Box>
            );
        }
    }
}

export {Solution}