import React from 'react'
import { Box } from 'rebass'
import './App.css'
import dice from './images/dice.png'

class Failure extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			loseMessages: ["Oh no!", "Not this time!", "Better luck next time!", "Nice try!"],
			currentLoseMessage: 0,
			penalty: 0,
		}
	}

	componentDidMount () {
		let loseMessageIdx = Math.floor(Math.random() * 4);
		let randPenalty = Math.floor(Math.random() * 5) + 3;
		this.setState ({currentLoseMessage: loseMessageIdx, penalty: randPenalty})
	}

	render () {
		return (
			<Box
			sx={{
				display: 'grid',
				gridGap: 3
			}}>
			<Box><div className="non-interact"></div></Box>
			<Box>
				<div id="lose-message">
					<p className="win-lose-start center">{this.state.loseMessages[this.state.currentLoseMessage]}</p>
					<p className="win-lose-result center"></p>
					{/*<img className="dice" src={dice} alt="Echo Games' dice"/>*/}
				</div>
			</Box>
			</Box>
		);
	}
}

export { Failure }