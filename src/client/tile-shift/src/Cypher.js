import React from 'react'
import { Box } from 'rebass'
import SwipeableViews from 'react-swipeable-views';
import ladder from './images/ladder.png'
import './App.css'

function importAll(r) {
	return r.keys().map(r);
}
const cypher = importAll(require.context('./images/cypher', false, /\.(png|jpe?g|svg)$/));

const cypherLetters = ['A', 'E', 'S', 'D', 'M', 'L', 'T', 'U']
const cypherWords = [
					'DAME', 'MADE', 'MALE', 'MALT',
					'MEAL', 'MELT', 'MUSE', 'SAME',
					'TAME', 'TEAM', 'DEAL', 'DUET',
					'LEAD', 'EAST', 'SALT', 'LATE',
					'TALE', 'TEAL', 'UTES', 'EATS',
					'USED', 'STEM', 'MULE', 'MATE'
				]

const blink = document.getElementsByClassName('cypher-input-answer-background')

class CypherGrid extends React.Component {
	constructor (props) {
		super (props)
		this.state = {
			letters: cypherLetters,
		}
	}

	render () {
		return (
			<div>
				<Box><div className="cypher-swipe-instruction">Swipe right to input answer</div></Box>
				<Box
					sx={{
						display: 'grid',
						gridGap: 3,
						gridTemplateColumns: [
							'repeat(2, 1fr)',
							'repeat(4, 1fr)'
						],
						width: '80vw',
						marginTop: '5vh', 
						marginLeft: '10vw'
					}}>
					{[0,1,2,3,4,5,6,7].map ((tileIdx) => 
						<Box key={tileIdx}>
							<img draggable={false} alt={this.state.letters[tileIdx]} className="cypher-img-grid" src={this.props.cypherImages[tileIdx]} />
							<div className="boxy">
							: {this.state.letters[tileIdx]}
							</div>
						</Box>)}
				</Box>
			</div>
		)
	}
}

/**
  * Handle input from the user and check if they've solved the problem
  */
class CypherInput extends React.Component {
	constructor (props) {
		super (props)
		this.state = {
			value: '',
			feedback: 'Input your answer below'
		}

		this.handleChange = this.handleChange.bind (this);
	}

	handleChange (ev) {
		this.setState ({value: ev.target.value})
		blink[0].classList.remove("blink")
	}

	handleSubmit () {
		let response = this.state.value;
		if (response.toUpperCase () === this.props.answer) {
			this.props.onSolution ()
		} else {
			this.setState ({feedback: 'Wrong answer. Try again'})
			blink[0].classList.add("blink")
			this.setState ({ value: '' })
		}
	}

	render () {
		return (
			<div>
				<div className="cypher-input-answer">
					<div className="cypher-input-answer-background"></div>
					<p className={"cypher-input-answer-text center"}>{this.state.feedback}</p>
				</div>
				<input type="text" maxLength="4" className="cypher-input" value={this.state.value} onChange={this.handleChange}></input>
				<br/>
				<button className="cypher-submit" onClick={ () => {this.handleSubmit ()} }>Submit</button>
			</div>
		)
	}
}

class CypherPuzzle extends React.Component {
	constructor (props) {
		super (props)
		this.state = {
			words: cypherWords,
			cypher: [],
			answer: ''
		}
	}

	/**
	 * On mount we pick a random word from the
	 * dictionary and construct the cypher based on it
	 */
	componentDidMount () {
		let word = this.state.words[Math.floor (Math.random () * 24)];
		let wordLetters = word.split ('');
		let newCypher = wordLetters.map ((letter) => cypherLetters.indexOf (letter))
		this.setState ({cypher: newCypher, answer: word})
		// console.log ('Chose', word, 'and this maps to', newCypher)
	}

	render () {
		return (
			<div>
				<div>
					<Box
						sx={{
							display: 'grid',
							gridGap: 0
					}}>
						<Box><div className="cypher-swipe-instruction">Swipe left to view cypher</div></Box>
						<Box
							sx={{
								display: 'grid',
								paddingBlock: '4vh',
								paddingInline: '4vw',
								borderBottom: '1px solid black',
								gridGap: '4vw',
								gridTemplateColumns: [
									'repeat(4, 1fr)',
								]
							}}>
							{
								this.state.cypher.map ((tileIdx) => 
									<Box key={tileIdx}><img draggable={false} alt="alt text" className="photo" src={cypher[tileIdx]} /></Box>)
							}
						</Box>
						<Box>
							<CypherInput 
								onSolution={ () => this.props.onSolution () }
								answer={this.state.answer}
							/>
						</Box>
					</Box>
				</div>
			</div>
		)
	}
}

class Cypher extends React.Component {
	constructor (props) {
		super (props)
		this.state = {
			currentTimeRemaining: this.props.timeToComplete,
			timeString: '',
		}
	}

	componentDidMount () {
		this.timerID = setInterval (() =>
			this.tick (), 
			1000
		);

		if (this.props.timeToComplete < 10) {
			this.setState ({timeString: '0' + this.props.timeToComplete});
		} else {
			this.setState ({timeString: '' + this.props.timeToComplete})
		}
	}

	componentWillUnmount () {
		clearInterval (this.timerID);
	}

	tick () {
		let timeRemaining = this.state.currentTimeRemaining - 1;
		if (timeRemaining < 0) {
			this.props.onFailure ()
		} else {
			if (timeRemaining < 10) {
				this.setState ({timeString: '0' + timeRemaining});
			} else {
				this.setState ({timeString: '' + timeRemaining})
			}
			this.setState ({currentTimeRemaining: timeRemaining})
		}
	}

	render () {
		return (
			<div>
				<img draggable={false} className="background-image" src={ladder} alt="Echo Games' ladder"/>
				<div className="timer">
					Time left: {this.state.timeString}
				</div>
				<SwipeableViews enableMouseEvents={true}>
					<CypherPuzzle
						onSolution={ () => this.props.onSolution () }
					/>
					<CypherGrid 
						cypherImages={cypher}
					/>
				</SwipeableViews>
			</div>
		)
	}
}

export { Cypher }