import React from 'react'
import {Box} from 'rebass'
import './IntroText.css';

class Intro extends React.Component {
    itemHasValue(key) {
        return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
    }

    network() {
        let url = this.itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
        url = "http://" + url + ":3000"
        fetch(url + '/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: 2,
                progress: 0,
                limit: this.props.numberToComplete,
            })
        })
        fetch(url + '/set-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: 2,
                user: "",
            })
        })
    }

    render() {
        this.network()
        return (
            <Box
                sx={{
                    display: 'grid',
                    gridGap: 0,
                }}>
                {/*<Box><img className="background-image" src={ladder} alt="Echo Games' ladder"/></Box>*/}
                <Box><h1
                    className="game-title center">{this.props.game === 'puzzle_shift' ? 'Tile Shift!' : 'Cypher Cracker!'}</h1>
                </Box>
                <Box><p
                    className="instructions center">{this.props.game === 'puzzle_shift' ? 'Tap tiles to swap them and recreate the picture' : 'Use the cypher to decode the 4-letter word'}</p>
                </Box>
                <div className="name">
                    <label className="answerLabel" htmlFor="userName">Your Name: </label>
                    <input className="answerBox" type="text" id="userName" name="answer"
                           defaultValue={localStorage.getItem("userName2")}/>
                </div>
                <Box>
                    <button className="play center"
                            onClick={() => {
                                this.props.onClick();
                            }}
                    >Play!
                    </button>
                </Box>
                <Box>
                    <div className="win-lose center">
                        <p></p>
                        {/*<p>Lose: Go forward 3 to 8 spaces</p>*/}
                    </div>
                </Box>
            </Box>
    );
    }
    }

    export
        {
            Intro
        }