import React from 'react'
import './App.css'
import { Board } from './ImageTilesBoard'
import { Cypher } from './Cypher'

class Game extends React.Component {

	playerSolved () {
		this.props.playerSolved ()
	}

	playerFailed () {
		this.props.playerFailed ()
	}

	render () {
		return (
				this.props.game === 'puzzle_shift' ? 
				<Board 
					onSolution={ () => this.props.onPlayerSolved () } 
					onFailure={ () => this.props.onPlayerFailed () } 
					timeToComplete = {30}
					showImagePreview={false}
					imagePreviewTime={1}
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