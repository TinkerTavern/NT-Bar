import React from 'react'
import {Box} from 'rebass'
import './App.css'
import needleEnd from './images/Needlepoint_End.png'

class Solution extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numberToComplete: 3,
        }
    }

    onComponentDidMount() {
        let winMessageIdx = Math.floor(Math.random() * 4);
        this.setState({currentWinMessage: winMessageIdx});
    }

    itemHasValue(key) {
        return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
    }

    updateScore() {
        let url = this.itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
        url = "http://" + url + ":3000"
        fetch(url + '/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: 2,
                progress: this.props.gamesWon,
            })
        })
    }

    boldString(str, find) {
        var re = new RegExp(find, 'g');
        return str.replace(re, '<b>' + find + '</b>');
    }


    render() {
        this.updateScore()
        console.log(this.props.gamesLeft);
        console.log(this.props.gamesWon);
        if (this.props.gamesLeft > this.props.gamesWon) {
            return (
                <Box
                    sx={{
                        display: 'grid',
                        gridGap: 0
                    }}>
                    <Box>
                        <div id="win-message" className={"outro-grid"}>
                            <figure className="person outro-person">
                                <img src={needleEnd} draggable={false}
                                     alt={"Mrs James Gregory, née Isobella Macleod (1770–1847) by Henry Raeburn (1756–1823) National Trust for Scotland, Fyvie Castle"}
                                     title={"Mrs James Gregory, née Isobella Macleod (1770–1847) by Henry Raeburn (1756–1823) National Trust for Scotland, Fyvie Castle"}/>
                                <figcaption
                                    className={"imageBy"}>{"Background image by GarryKillian on Freepik"} </figcaption>
                            </figure>
                            <h1 id="win-lose" className="win-title">Win</h1>
                            <p className="win-lose-start ">{"That's really pretty, well done! Hope you didn't prick yourself in the process."}</p>
                            <button className="play " onClick={() => {
                                document.location.reload()
                            }}>Next needlepoint...
                            </button>
                        </div>
                    </Box>
                </Box>
            );
        } else {
            this.submitScore();
            var str = "Eliza de Feuillide, your cousin, is absolutely delighted not only by the precision of the needlework but by the attention it provides her. All the ladies present are praising her newly acquired needlepoints. In your grand generosity, you’ve even allowed to take credit for the best one of them. How delightful!\n" +
                "\n" +
                "Extremely pleased, she brings you along to the drawing room where the chatter is as intense as it gets. Now in her inner gossiping circle, you are surprised to learn that Isobel has been quite inconsiderate during the months leading to her nuptials. Indeed, it has been said that Isobel was hurtful to many people, including those closest to her.\n" +
                "\n" +
                "That surprises you of your friend, but you know how the months leading up to a wedding can be taxing at times, and you are sure that Isobel did not mean anything by it. Surely, she cannot have hurt a close one’s feelings to the point where they would murder someone over it… Surely.\n" +
                "\n" +
                "Full of doubts and worries for your friend, you move on, hoping to find less troubling leads."
            str = this.boldString(str, "closest to her")
            return (
                <Box
                    sx={{
                        display: 'grid',
                        gridGap: 0
                    }}>
                    <Box>
                        <div id="win-message" className={"outro-grid"}>
                            <figure className="person outro-person">
                                <img src={needleEnd} draggable={false}
                                     alt={"Mrs James Gregory, née Isobella Macleod (1770–1847) by Henry Raeburn (1756–1823) National Trust for Scotland, Fyvie Castle"}
                                     title={"Mrs James Gregory, née Isobella Macleod (1770–1847) by Henry Raeburn (1756–1823) National Trust for Scotland, Fyvie Castle"}/>
                                <figcaption
                                    className={"imageBy"}>{"Background image by GarryKillian on Freepik"} </figcaption>
                            </figure>
                            <h1 id="win-lose" className="win-title">Win</h1>
                            <p className="win-lose-start" dangerouslySetInnerHTML={{__html: str}}/>
                            <button className=" play" onClick={() => {
                                localStorage.setItem("4xMode", "off")
                                document.location.reload()
                            }}>Challenge me!
                            </button>
                        </div>
                    </Box>
                </Box>
            );
        }
    }


    submitScore() {
        let url = this.itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
        url = "http://" + url + ":3000"
        fetch(url + '/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: 2,
                user: localStorage.getItem("userName2"),
                time: this.props.timeTaken
            })
        })
    }
}

export
{
    Solution
}