import './App.css';
import React from 'react'
import {Game} from './Game'
import {Intro} from './IntroText'
import {Solution} from './Solution'
import {Failure} from './Failure'

// Define this in your .env file. See https://create-react-app.dev/docs/adding-custom-environment-variables
// We build cypher by default
const GAME_TO_BUILD = process.env.REACT_APP_GAME_TO_BUILD ? process.env.REACT_APP_GAME_TO_BUILD : 'cypher'

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mode: 'intro',
            numberToComplete: this.itemHasValue("noToSolve") ? parseInt(localStorage.getItem("noToSolve")) : 3,
            gamesWon: this.itemHasValue("needlepointProgress") ? parseInt(localStorage.getItem("needlepointProgress")) : 0,
            counter: 0,
        }
    }

    startPuzzleTimer() {
        this.timerID = setInterval(() =>
                this.tick(),
            1000
        );
    }

    tick() {
        this.state.counter++
    }

    itemHasValue(key) {
        return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
    }

    resetScore() {
        // alert("Resetting score...")
        this.state.gamesWon = 0;
        localStorage.setItem("needlepointProgress", 0)
        this.updateScore()
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
                progress: 0,
                limit: this.state.numberToComplete
            })
        })
    }

    submitUser() {
        let url = this.itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
        url = "http://" + url + ":3000"
        localStorage.setItem("userName2", document.getElementById("userName").value);
        fetch(url + '/set-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: 2,
                user: document.getElementById("userName").value,
            })
        })
    }

    handleClick() {
        this.submitUser();
        this.setState({mode: 'game'})
    }


    playerSolved() {
        this.setState({mode: 'solved'})

    }

    playerFailed() {
        this.setState({mode: 'failed'})
    }

    continue
    () {
        this.setState({mode: 'game'})
    }

    render() {
        let artefact;

        if (this.state.mode === 'intro')
            artefact = <Intro
                reset={() => this.resetScore()}
                game={GAME_TO_BUILD}
                onClick={() => this.handleClick()}
                numberToComplete={this.state.numberToComplete}
            />
        else if (this.state.mode === 'game') {
            this.startPuzzleTimer()
            artefact = <Game
                game={GAME_TO_BUILD}
                gamesWon={this.state.gamesWon}
                onPlayerSolved={() => this.playerSolved()}
                onPlayerFailed={() => this.playerFailed()}
            />
        } else if (this.state.mode === 'solved') {
            this.state.gamesWon++;
            localStorage.setItem("needlepointProgress", this.state.gamesWon)
            console.log("won", this.state.gamesWon)
            artefact = <Solution
                gamesLeft={this.state.numberToComplete}
                gamesWon={this.state.gamesWon}
                timeTaken={this.state.counter}
            />
        } else if (this.state.mode === 'failed')
            artefact = <Failure/>

        return (
            <div className="App">
                <header className="App-header">
                    {artefact}
                </header>
            </div>
        );
    }
}

export default App;
