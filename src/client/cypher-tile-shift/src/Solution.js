import React from 'react'
import {Box} from 'rebass'
import './App.css'
import needleEnd from './images/Needlepoint_End.png'
import needle1 from "./images/Progress/Needlepoint1.PNG";
import needle2 from "./images/Progress/Needlepoint2.PNG";
import needle3 from "./images/Progress/Needlepoint3.PNG";

class Solution extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numberToComplete: 3,
            retString: "",
            firstLoad: true,
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
        if (this.state.firstLoad) {
            this.updateScore()
            this.submitScore();
        }
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
                            <div id="score-info"
                                 className={(this.state.retString === "" ? "score-info hidden" : "score-info")}
                                 dangerouslySetInnerHTML={{__html: this.state.retString}}/>
                            <button className={this.state.retString === "" ? "play spann" : "play"} onClick={() => {
                                document.location.reload()
                            }}>Next needlepoint...
                            </button>
                        </div>
                    </Box>
                </Box>
            );
        } else {
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
                            <div id="score-info"
                                 className={this.state.retString === "" ? "score-info hidden" : "score-info"}
                                 dangerouslySetInnerHTML={{__html: this.state.retString}}/>
                            <button className={this.state.retString === "" ? "play spann" : "play"} onClick={() => {
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

    loadScoreInfo(data) {
        let add = this.props.timeTaken === 1 ? " second." : " seconds."
        let retStr = "You took " + this.props.timeTaken + add
        let pos = data["position"]
        let extra;
        let str = "\nGood job!\n"
        add = data["scoreToBeat"] === 1 ? " second " : " seconds "
        if (pos === -1)
            str += "You were " + data["scoreToBeat"] + add + " away from getting on the leaderboard!"
        else {
            extra = ""
            switch (pos) {
                case 1:
                    extra = "st "
                    break;
                case 2:
                    extra = "nd "
                    break;
                case 3:
                    extra = "rd "
                    break;
                default:
                    extra = "th "
                    break;
            }
            str += "You're " + pos + extra + "on the leaderboard!"
        }
        this.setState((state) => {
            // Important: read `state` instead of `this.state` when updating.
            state.firstLoad = false;
            return {retString: retStr + str}
        });
    }


    submitScore() {
        console.log("oki")
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
        }).then(res => res.json()).then(data => {
                if (localStorage.getItem("hideScoreInfo") !== "on")
                    this.loadScoreInfo(data)
                else {
                    document.getElementById("score-info").style.display = 'none';
                    document.getElementById("restartButton").style.gridColumn = "auto / span 2";
                }
            }
        )
    }
}

export
{
    Solution
}