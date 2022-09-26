import React from 'react'
import './App.css'
import {Board} from './ImageTilesBoard'
import {Cypher} from './Cypher'

class Game extends React.Component {

	playerSolved () {
		this.props.playerSolved ()
	}

	playerFailed () {
		this.props.playerFailed ()
	}

	continue() {
		this.props.continue ()
	}

	render () {
		return (
				this.props.game === 'puzzle_shift' ? 
				<Board
					gamesWon={this.props.gamesWon}
					onSolution={ () => this.props.onPlayerSolved () } 
					onContinue ={ () => this.props.continue () }
					onFailure={ () => this.props.onPlayerFailed () }
					timeToComplete = {30}
					showImagePreview={false}
					imagePreviewTime={0.5}
				/> :
				<Cypher 
					timeToComplete={30}
					onFailure={ () => this.props.onPlayerFailed () }
					onSolution={ () => this.props.onPlayerSolved () }
				/>
		)
	}
}

export { Game }