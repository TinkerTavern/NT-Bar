import React from 'react'
import {Box} from 'rebass'
import 'animate.css'
import './App.css'
import frame from './images/Frame.png'
import needlepoint1 from './images/Needlepoint1.png'
import needlepoint2 from './images/Needlepoint2.png'
import needlepoint3 from './images/Needlepoint3.png'

/**
 * Handy way of importing all files in a folder together
 *
 * From here: https://stackoverflow.com/questions/53777194/webpack-dynamic-import-method-returns-empty-array-instead-of-files-in-reactjs-h
 */

// TODO: Find out a tile shift method instead (https://github.com/danba340/react-sliding-puzzle)
function importAll(r) {
    return r.keys().map(r);
}

function itemHasValue(key) {
    return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
}

const mode = localStorage.getItem("4xMode") !== "on" ? 4 : 3;
const timer = itemHasValue("timer") ? localStorage.getItem("timer") !== "-1" : false;

var needlepoint1Images, needlepoint2Images, needlepoint3Images

if (mode === 4) {
    needlepoint1Images = importAll(require.context('./images/Needlepoint14x4', false, /\.(png|jpe?g|svg)$/));
    needlepoint2Images = importAll(require.context('./images/Needlepoint24x4', false, /\.(png|jpe?g|svg)$/));
    needlepoint3Images = importAll(require.context('./images/Needlepoint34x4', false, /\.(png|jpe?g|svg)$/));
} else {
    needlepoint1Images = importAll(require.context('./images/Needlepoint13x3', false, /\.(png|jpe?g|svg)$/));
    needlepoint2Images = importAll(require.context('./images/Needlepoint23x3', false, /\.(png|jpe?g|svg)$/));
    needlepoint3Images = importAll(require.context('./images/Needlepoint33x3', false, /\.(png|jpe?g|svg)$/));
}

/**
 * Basic animate css template from https://animate.style/
 */
const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });

class Tile extends React.Component {
    tileName = mode === 3 ? "threeTile" : "fourTile";

    render() {
        return (
            <button
                className='tile'
                onClick={() => {
                    this.props.onClick()
                }}
            >
                <img className={this.tileName} draggable={false} src={this.props.tileImage} alt={this.props.alt}/>
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);

        const imageIdx = this.props.gamesWon; //TODO make this not random
        var imageSet;
        var imagePreview;
        switch (imageIdx % 3) {
            case 0:
                imageSet = needlepoint1Images;
                imagePreview = needlepoint1;
                break;
            case 1:
                imageSet = needlepoint2Images;
                imagePreview = needlepoint2;
                break;
            default:
                imageSet = needlepoint3Images;
                imagePreview = needlepoint3;
        }


        this.state = {
            active: false,
            tiles: [...Array(mode === 4 ? 16 : 9).keys()],
            images: imageSet,
            preview: imagePreview,
            currentSelection: -1,
            currentTimeRemaining: itemHasValue("timer") ? parseInt(localStorage.getItem("timer")) : this.props.timeToComplete,
            timeString: '',
        };
    }

    startPuzzleTimer() {
        if (timer) {
            this.timerID = setInterval(() =>
                    this.tick(),
                1000
            );
        }
    }

    showImagePreview() {
        // Show the image preview for a set number of seconds
        setTimeout(() => {
            animateCSS('.image-preview', 'fadeOut').then((message) => {
                this.setState({active: true})
                this.startPuzzleTimer()
            });
        }, itemHasValue("previewTimer") ? parseInt(localStorage.getItem("previewTimer")) * 1000 : this.props.imagePreviewTime * 1000);
    }

    showImagePostview() {
        // Show the image preview for a set number of seconds
        this.state.active = false;
        setTimeout(() => {
            animateCSS('.image-preview', 'fadeOut').then((message) => {
                this.props.onSolution()
            });
        }, itemHasValue("previewTimer") ? parseInt(localStorage.getItem("previewTimer")) * 1000 : this.props.imagePreviewTime * 1000);
    }

    componentDidMount() {
        // Randomize the tile list
        let tilesArr = this.state.tiles;
        this.shuffleArray(tilesArr)
        this.setState({tiles: tilesArr})

        if (this.state.currentTimeRemaining < 10) {
            this.setState({timeString: '0' + this.state.currentTimeRemaining});
        } else {
            this.setState({timeString: '' + this.state.currentTimeRemaining})
        }

        if (localStorage.getItem("preview") === "on") {
            this.showImagePreview()
        } else {
            this.setState({active: true})
            this.startPuzzleTimer()
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    tick() {
        let timeRemaining = this.state.currentTimeRemaining - 1;
        if (timeRemaining < 0) {
            this.props.onFailure()
        } else {
            if (timeRemaining < 10) {
                this.setState({timeString: '0' + timeRemaining});
            } else {
                this.setState({timeString: '' + timeRemaining})
            }
            this.setState({currentTimeRemaining: timeRemaining})
        }
    }

    handleClick(i) {
        if (this.state.currentSelection === -1) {
            this.setState({currentSelection: i})
        } else {
            let tit = i
            let tat = this.state.currentSelection
            let newTiles = this.state.tiles;

            let temp = newTiles[tit]
            newTiles[tit] = newTiles[tat]
            newTiles[tat] = temp

            this.setState({tiles: newTiles, currentSelection: -1})
            this.checkSolution(); // Check if we're correct
        }
    }

    checkSolution() {
        var isAscending = a => a.slice(1).every(this.getCondition(a));
        if (isAscending(this.state.tiles)) {
            if (localStorage.getItem("postview") !== "on") {
                this.showImagePostview()
            } else {
                this.props.onSolution()
            }
        }
    }

    getCondition(a) {
        return (e, i) => e > a[i];
    }

    renderTile(i) {
        return (
            <Tile
                tileImage={this.state.images[this.state.tiles[i]]}
                onClick={() => this.handleClick(i)}
                alt={"Tile " + i}
            />
        )
    }


    render() {
        var mainView;
        if (this.state.active) {
            if (mode === 4) {
                mainView = <Box className={"tileGrid four"}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: [
                                        'repeat(4, 1fr)',
                                        'repeat(4, 1fr)'
                                    ],
                                    marginLeft: "25%",
                                    marginTop: "-2%",
                                }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((tileIdx) => <Box
                        key={tileIdx}>{this.renderTile(tileIdx)}</Box>)}
                </Box>
            } else {
                mainView = <Box className={"tileGrid three"}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: [
                                        'repeat(3, 1fr)',
                                        'repeat(3, 1fr)'
                                    ],
                                    marginLeft: "25%",
                                    marginTop: "-2%",
                                }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((tileIdx) => <Box
                        key={tileIdx}>{this.renderTile(tileIdx)}</Box>)}
                </Box>
            }
        } else {
            mainView = <Box>
                <div className={"outside-image"}>
                    <img draggable={false} className="image-preview" src={this.state.preview} alt="alt text"/>
                </div>
            </Box>
        }

        if (timer)
            return (
                <div>
                    <Box
                        sx={{
                            maxWidth: 768,
                            mx: 'auto',
                            px: 3,
                            py: 4
                        }}>
                        <div className="timer">Time left: {this.state.timeString}</div>
                    </Box>
                    {mainView}
                </div>
            )
        else
            return (
                <div>
                    <Box
                        sx={{
                            maxWidth: 768,
                            mx: 'auto',
                            px: 3,
                            py: 4
                        }}>
                    </Box>
                    {mainView}
                </div>
            )
    }
}

export {Tile, Board}