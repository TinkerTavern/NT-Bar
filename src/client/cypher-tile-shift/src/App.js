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
            gamesWon: 0,
        }
    }

    itemHasValue(key) {
        return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
    }


    submitUser() {
        localStorage.setItem("userName2", document.getElementById("userName").value);
        fetch('http://127.0.0.1:3000/set-user', {
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

    continue() {
        this.setState({mode: 'game'})
    }

    render() {
        let artefact;

        if (this.state.mode === 'intro')
            artefact = <Intro
                game={GAME_TO_BUILD}
                onClick={() => this.handleClick()}
                numberToComplete={this.state.numberToComplete}
            />
        else if (this.state.mode === 'game')
            artefact = <Game
                game={GAME_TO_BUILD}
                onPlayerSolved={() => this.playerSolved()}
                onPlayerFailed={() => this.playerFailed()}
            />
        else if (this.state.mode === 'solved') {
            this.state.numberToComplete--;
            this.state.gamesWon++;
            console.log("left" + this.state.numberToComplete)
            artefact = <Solution
                onContinue={() => this.continue()}
                gamesLeft={this.state.numberToComplete}
                gamesWon={this.state.gamesWon}
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
