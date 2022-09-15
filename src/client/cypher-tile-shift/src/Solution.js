import React from 'react'
import { Box } from 'rebass'
import './App.css'
import dice from './images/dice.png'

class Solution extends React.Component {

	constructor (props) {
		super (props);
		this.state = {
			winMessages: ["You did it!", "Great!", "Nice job!", "Good work!"],
			currentWinMessage: 0,
		}
	}

	onComponentDidMount () {
		let winMessageIdx = Math.floor(Math.random() * 4);
		this.setState ({currentWinMessage: winMessageIdx});
	}

	updateScore() {
		fetch('http://127.0.0.1:5000/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				task: 1,
				progress: 1,
			})
		})
	}

	render () {
		this.updateScore()
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
					<button className="center restart" onClick={() => {document.location.reload()}}>Restart</button>
					{/*<img className="dice" src={dice} alt="Echo Games' dice"/>*/}
				</div>
			</Box>
			</Box>
		);
	}
}

export { Solution }