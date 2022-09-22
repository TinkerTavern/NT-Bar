import React from 'react'
import {Box} from 'rebass'
import './IntroText.css';
import ladder from './images/ladder.png'

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
            <div className="intro-grid">
                <img className="person" src={ladder} alt="Echo Games' ladder"/>
                <h1
                    className="game-title">{this.props.game === 'puzzle_shift' ? 'Tile Shift!' : 'Cypher Cracker!'}</h1>
                <p></p>
                <p
                    className="instructions">{this.props.game === 'puzzle_shift' ? 'Tap tiles to swap them and recreate the picture\n' +
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eleifend luctus nisl, in porttitor mauris.\n' +
                    'Sed id quam mauris. Mauris est enim, ultrices nec dolor a, rhoncus cursus risus.\n' +
                    '\n' +
                    'Suspendisse lacinia diam ac enim imperdiet, nec ullamcorper neque posuere.\n' +
                    '\n' +
                    'Ut nulla erat, elementum ac ornare ut, congue a neque. Maecenas pulvinar metus ipsum, ac vestibulum elit vestibulum non.\n' : 'Use the cypher to decode the 4-letter word'}</p>
                <p></p>
                <div className="name">
                    <label className="answerLabel" htmlFor="userName">Your Name: </label>
                    <input className="answerBox" type="text" id="userName" name="answer"
                           defaultValue={localStorage.getItem("userName2")}/>
                </div>
                <button className="play"
                        onClick={() => {
                            this.props.onClick();
                        }}
                >Play!
                </button>
                <Box>
                    <div className="win-lose center">
                        <p></p>
                        {/*<p>Lose: Go forward 3 to 8 spaces</p>*/}
                    </div>
                </Box>
            </div>
        );
    }
}

export
{
    Intro
}