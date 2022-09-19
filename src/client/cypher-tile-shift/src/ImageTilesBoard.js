import React from 'react'
import {Box} from 'rebass'
import 'animate.css'
import './App.css'
import ladder from './images/background.jpg'
import cave from './images/cave.jpg'
import space from './images/space.jpg'
import rocket from './images/rocket.jpg'
import planet from './images/planet.jpg'
import office from './images/office.jpg'

/**
 * Handy way of importing all files in a folder together
 *
 * From here: https://stackoverflow.com/questions/53777194/webpack-dynamic-import-method-returns-empty-array-instead-of-files-in-reactjs-h
 */
function importAll(r) {
    return r.keys().map(r);
}

function itemHasValue(key) {
    return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
}

const mode = localStorage.getItem("4xMode") !== "on" ? 4 : 3;
const timer = itemHasValue("timer") ? localStorage.getItem("timer") !== "-1" : false;

var caveImages, planetImages, rocketImages, spaceImages, officeImages

if (mode === 4) {
    caveImages = importAll(require.context('./images/cave4x4', false, /\.(png|jpe?g|svg)$/));
    planetImages = importAll(require.context('./images/planet4x4', false, /\.(png|jpe?g|svg)$/));
    rocketImages = importAll(require.context('./images/rocket4x4', false, /\.(png|jpe?g|svg)$/));
    spaceImages = importAll(require.context('./images/space4x4', false, /\.(png|jpe?g|svg)$/));
    officeImages = importAll(require.context('./images/office4x4', false, /\.(png|jpe?g|svg)$/));
} else {
    caveImages = importAll(require.context('./images/cave3x3', false, /\.(png|jpe?g|svg)$/));
    planetImages = importAll(require.context('./images/planet3x3', false, /\.(png|jpe?g|svg)$/));
    rocketImages = importAll(require.context('./images/rocket3x3', false, /\.(png|jpe?g|svg)$/));
    spaceImages = importAll(require.context('./images/space3x3', false, /\.(png|jpe?g|svg)$/));
    officeImages = importAll(require.context('./images/office3x3', false, /\.(png|jpe?g|svg)$/));
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
    render() {
        return (
            <button
                className='tile'
                onClick={() => {
                    this.props.onClick()
                }}
            >
                <img draggable={false} src={this.props.tileImage} alt={this.props.alt}/>
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);

        const imageIdx = Math.floor(Math.random() * 5);
        var imageSet;
        var imagePreview;
        switch (imageIdx) {
            case 0:
                imageSet = caveImages;
                imagePreview = cave;
                break;
            case 1:
                imageSet = planetImages;
                imagePreview = planet;
                break;
            case 2:
                imageSet = rocketImages;
                imagePreview = rocket;
                break;
            case 3:
                imageSet = officeImages;
                imagePreview = office;
                break;
            default:
                imageSet = spaceImages;
                imagePreview = space;
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
        }, this.props.imagePreviewTime * 1000);
    }

    componentDidMount() {
        // Randomize the tile list
        let tilesArr = this.state.tiles;
        this.shuffleArray(tilesArr)
        this.setState({tiles: tilesArr})

        if (this.props.timeToComplete < 10) {
            this.setState({timeString: '0' + this.props.timeToComplete});
        } else {
            this.setState({timeString: '' + this.props.timeToComplete})
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
            this.props.onSolution()
        }
    }

    getCondition(a) {
        console.log(a)
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
                mainView = <Box
                    sx={{
                        display: 'grid',
                        gridGap: 1,
                        gridTemplateColumns: [
                            'repeat(4, 1fr)',
                            'repeat(4, 1fr)'
                        ],
                    }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((tileIdx) => <Box
                        key={tileIdx}>{this.renderTile(tileIdx)}</Box>)}
                </Box>
            } else {
                mainView = <Box
                    sx={{
                        display: 'grid',
                        gridGap: 1,
                        gridTemplateColumns: [
                            'repeat(3, 1fr)',
                            'repeat(3, 1fr)'
                        ],
                    }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((tileIdx) => <Box
                        key={tileIdx}>{this.renderTile(tileIdx)}</Box>)}
                </Box>
            }
        } else {
            mainView = <Box>
                <img draggable={false} className="image-preview" src={this.state.preview} alt="alt text"/>
            </Box>
        }

        if (timer)
            return (
                <div>
                    <img draggable={false} className="background-image" src={ladder} alt="Echo Games' ladder"/>
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
                    <img draggable={false} className="background-image" src={ladder} alt="Echo Games' ladder"/>
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