import React from 'react'
import {Box} from 'rebass'
import './IntroText.css';
import needleIntro from './images/Needlepoint_Intro.png'
import needle1 from './images/Progress/Needlepoint1.PNG'
import needle2 from './images/Progress/Needlepoint2.PNG'
import needle3 from './images/Progress/Needlepoint3.PNG'

class HighScoreTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: []
        }
    }

    itemHasValue(key) {
        return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
    }


    componentDidMount() {
        let url = this.itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
        url = "http://" + url + ":3000"
        fetch(url + '/get-leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: 2,
            })
        }).then(res => res.json()).then(
            (players) => {
                this.setState({players: players["boardDict"]});
            },
            (error) => {
                alert("Server not available");
                console.log(error)
            }
        )
    }

    render() {
        if (localStorage.getItem("hideLeaderboard") !== "on")
            return (
                <section className="grid-spot progress" id="danceScores">
                    High Scores!
                    <table className={"leaderboard"}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                        </thead>

                        <tbody>
                        {this.state.players.map(player =>
                            <tr>
                                <td>{player.name}</td>
                                <td>{player.score}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </section>);
        else
            return <section className="grid-spot progress hide" id="danceScores" />
    }
}

class ProgressImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: []
        }
    }

    itemHasValue(key) {
        return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
    }

    render() {
        let prog = this.itemHasValue("needlepointProgress") ? parseInt(localStorage.getItem("needlepointProgress")) : 0;
        if (localStorage.getItem("hideProgress") !== "on")
            return (
                <div className="column">
                    <img draggable="false" id="needle1" className={prog > 0 ? "tileImg image" : "tileImg image locked"}
                         src={needle1}/>
                    <img draggable="false" id="needle2" className={prog > 1 ? "tileImg image" : "tileImg image locked"}
                         src={needle2}/>
                    <img draggable="false" id="needle3" className={prog > 2 ? "tileImg image" : "tileImg image locked"}
                         src={needle3}/>
                </div>);
        else
            return <div className="column hide"/>
    }
}


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
                progress: this.itemHasValue("needlepointProgress") ? parseInt(localStorage.getItem("needlepointProgress")) : 0,
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
        }).then(r => r.json()).then(response => {
            console.log(response)
            if (response["reset"] === true)
                this.confirmReset()
        })
    }

    confirmReset() {
        this.props.reset();
        let url = this.itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
        url = "http://" + url + ":3000"
        fetch(url + '/confirm-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: 2,
            })
        })
    }


    // loadImage() {
    //     let images = ["needlepoint1", "needlepoint2", "needlepoint3"]
    //     for (let j = 0; j < images.length; j++) {
    //         if (j >= Math.floor(((this.state.gamesWon / 3) / 0.333333))) {
    //             document.getElementById(images[j]).style.filter = "blur(35px)";
    //         } else {
    //             document.getElementById(images[j]).style.filter = "none";
    //         }
    //     }
    // }

    render() {
        this.network()
        return (
            <div className="intro-grid">
                <figure className="person">
                    <img src={needleIntro}/>
                    <p className={"imageBy"}>{"Background image by GarryKillian on Freepik\n" +
                        "Portrait of Lady Selina Caroline Meade, later Countess Clam-Martinic (1797–1872) by Sir Thomas Lawrence"}</p>
                </figure>
                <h1
                    className="game-title">{this.props.game === 'puzzle_shift' ? 'Needlepoint' : 'Cypher Cracker!'}</h1>
                <HighScoreTable/>
                <p
                    className="instructions">{this.props.game === 'puzzle_shift' ? "\n1802, Bath Assembly Rooms.\n" +
                    "\n" +
                    "The bridal Ball has taken a dark turn. The Earl is dead and the murderer is likely still here! Desperately afraid to be exposed to the worst sort of scandal, Isobel, now widow, has begged you for help. Would the ladies in attendance by chance know of any gossip that could inform your investigation?\n" +
                    "\n" +
                    "They might not reveal their juiciest information without a prompt though. What you need is a truly amazing set of gifts, something that will thrill and amaze them so much that they let you know all their secrets. You’ve had your needlework praised many a time before, surely you can put a few together that will make the ladies fawn over you!\n" +
                    "\n" +
                    "To do so, you’ll need to put back the needlepoints together. We can’t have a jigsaw puzzle as the final piece, no that just won’t do! Try swapping the tiles until they form an aesthetically pleasing shape. Something real, authentic - an animal or a flower perhaps? Good luck!"
                    : 'Use the cypher to decode the 4-letter word'}</p>
                <ProgressImage/>
                <div className="name">
                    <label className="answerLabel" htmlFor="userName">Your Name: </label><br/>
                    <input className="answerBox" type="text" id="userName" name="answer"
                           defaultValue={localStorage.getItem("userName2")}/>
                </div>
                <button className="play playOG"
                        onClick={() => {
                            this.props.onClick();
                        }}
                >Play!
                </button>
                <Box>
                    <div className="win-lose">
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