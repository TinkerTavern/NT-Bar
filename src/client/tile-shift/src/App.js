import './App.css';
import React from 'react'
import { Game } from './Game'
import { Intro } from './IntroText'
import { Solution } from './Solution'
import { Failure } from './Failure'

// Define this in your .env file. See https://create-react-app.dev/docs/adding-custom-environment-variables
// We build cypher by default
const GAME_TO_BUILD = process.env.REACT_APP_GAME_TO_BUILD ? process.env.REACT_APP_GAME_TO_BUILD : 'cypher'

class App extends React.Component {

	constructor (props) {
		super (props)
		this.state = {
			mode: 'intro',
		}
	}

	handleClick () {
		this.setState ({mode: 'game'})
	}

	playerSolved () {
		this.setState ({mode: 'solved'})

	}

	playerFailed () {
		this.setState ({mode: 'failed'});
	}

	render () {
		let artefact;

		if (this.state.mode === 'intro')
			artefact = <Intro 
						game={GAME_TO_BUILD} 
						onClick={ () => this.handleClick () }
						/>
		else if (this.state.mode === 'game')
			artefact = <Game 
						game={GAME_TO_BUILD}
						onPlayerSolved = { () => this.playerSolved () }
						onPlayerFailed = { () => this.playerFailed () }
						/>
		else if (this.state.mode === 'solved')
			artefact = <Solution />
		else if (this.state.mode === 'failed')
			artefact = <Failure />

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
