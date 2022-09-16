import React from 'react'
import { Box } from 'rebass'
import './IntroText.css';
import ladder from './images/background.jpg'

class Intro extends React.Component {

	render () {
		return (
			<Box
			sx={{
				display: 'grid',
				gridGap: 0
			}}>
			<Box><img className="background-image" src={ladder} alt="Echo Games' ladder"/></Box>
			<Box><h1 className="game-title center">{this.props.game === 'puzzle_shift' ? 'Tile Shift!' : 'Cypher Cracker!'}</h1></Box>
			<Box><p className="instructions center">{this.props.game === 'puzzle_shift' ? 'Tap tiles to swap them and recreate the picture' : 'Use the cypher to decode the 4-letter word'}</p></Box>
			<Box><button className="play center"
						onClick={ () => {this.props.onClick ();} }
					 >Play!</button></Box>
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

export { Intro }