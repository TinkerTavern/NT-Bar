import React from 'react'
import {Box} from 'rebass'
import './App.css'
import ladder from "./images/ladder.png";

class Failure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            penalty: 0,
        }
    }

    componentDidMount() {
        let loseMessageIdx = Math.floor(Math.random() * 4);
        let randPenalty = Math.floor(Math.random() * 5) + 3;
        this.setState({currentLoseMessage: loseMessageIdx, penalty: randPenalty})
    }

    render() {
        return (
            <Box
                sx={{
                    display: 'grid',
                    gridGap: 3
                }}>
                <Box>
                    <div id="win-message" className={"outro-grid"}>
                        <img className="person" src={ladder}/>
                        <h1 id="win-lose" className="win-title">Lose</h1>
                        <p className="win-lose-start">{"Pretty needlework for sure, but at this pace, the Season will be over and gone before you're done with them. Try to keep up!"}</p>
                        <button className="play " onClick={() => {
                            document.location.reload()
                        }}>Next needlepoint...
                        </button>
                    </div>
                </Box>
            </Box>
        );
    }
}

export {Failure}