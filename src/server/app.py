import socket
from os.path import join, dirname, realpath

from flask import Flask, render_template, request, jsonify, flash
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
progress = [0, 0, 0]
limits = [3, 3, 3]
players = ["", "", ""]
lastPlayers = [[""], [""], [""]]
totalAttempts = [0, 0, 0]
uniqueAttempts = [0, 0, 0]
msgAppend = ["", "", ""]
oldProgress = [-1, -1, -1]
reset = False
taskOpts = ["danceScores", "charadesScores", "needlepointScores"]
tasks = ["Master the dance!", "Solve the charades!",
         "Put the needlepoints back together!"]

# TODO: Find a way to stream/show screenshots of the player's games on server side


resetConfirmed = [False, False, False]


def get_val(val):
    ret_val = request.form.get(val)
    if ret_val is None:
        ret_val = request.json.get(val)
    if val == "task":
        ret_val = int(ret_val)
    elif val == "user":
        ret_val = ret_val.replace(",", "")  # Remove commas to prevent dumb issues
    return ret_val


def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        # ping random address to get the socket IP
        s.connect(('1.1.1.1', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = ''
    finally:
        s.close()
    print(IP)
    return IP


@app.route('/ping')
def ping():
    return jsonify(reset=reset, ping="pong")


@app.route('/')
def hello_world():
    return render_template("server.html", ip=get_ip())


@app.route('/get-leaderboard', methods=["POST"])
def get_leaderboard():
    taskID = get_val("task")
    # open text file in read mode
    file = join(dirname(realpath(__file__)), "static/leaders/" + taskOpts[taskID] + ".leaders")
    ret = []
    import csv
    with open(file, 'r') as f:
        data = f.read()
    with open(file, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            name, score = row
            ret.append({"name": name, "score": score})
    return jsonify(board=data, boardDict=ret)


@app.route("/get-ip", methods=["GET"])
def get_my_ip():
    print(request.remote_addr)
    return jsonify(reset=reset, ip=request.remote_addr), 200


@app.route("/update", methods=["POST"])
def update_task():
    limit = get_val("limit")
    taskID = get_val("task")
    progressVal = get_val("progress")
    if limit is not None:
        limits[taskID] = limit
    progress[taskID] = progressVal
    return jsonify(reset=reset, success=True)


@app.route("/submit", methods=["POST"])
def submit_score():
    user = get_val("user")
    taskID = get_val("task")
    time = get_val("time")
    file = join(dirname(realpath(__file__)), "static/leaders/" + taskOpts[taskID] + ".leaders")
    leaderboard = []
    time = int(time)
    position = -1
    print(taskID)
    scoreToBeat = 0
    import csv
    with open(file, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            leaderboard.append(row)
    for i, entry in enumerate(leaderboard):
        if (taskID == 0 and time > int(entry[1])) or (taskID != 0 and time < int(entry[1])):
            position = i+1
            leaderboard.insert(i, [user, time])
            del leaderboard[-1]
            break
    if position == -1:
        if taskID == 0:
            scoreToBeat = int(leaderboard[-1][1]) - time + 1
        else:
            scoreToBeat = time - int(leaderboard[-1][1]) + 1
    with open(file, 'w') as f:
        for entry in leaderboard:
            f.write(entry[0] + "," + str(entry[1]) + "\n")
    return jsonify(position=position, scoreToBeat=scoreToBeat, reset=reset, success=True)


@app.route("/set-user", methods=["POST"])
def set_user():
    user = get_val("user")
    taskID = get_val("task")
    lastPlayer = players[taskID]
    if lastPlayer not in lastPlayers[taskID]:
        lastPlayers[taskID].insert(0, lastPlayer)
    if user != lastPlayers[taskID][0] and user != "":
        uniqueAttempts[taskID] = uniqueAttempts[taskID] + 1
    players[taskID] = user
    for i, player in enumerate(players):
        if player != "":
            msgAppend[i] = " \n" + player
            totalAttempts[i] = totalAttempts[i] + 1
        elif lastPlayers[i] != "":
            msgAppend[i] = "\n" + lastPlayers[i][0]  # Else show how long since that player played
        else:
            msgAppend[i] = ""

    return jsonify(reset=reset, success=True)


@app.route('/get-tasks', methods=["GET"])
def index():
    for i in range(len(oldProgress)):
        oldProgress[i] = progress[i]
    tasksArr = [{"scenario": 1, "task": tasks[0], "progress": oldProgress[0], "limit": limits[0]},
                {"scenario": 2, "task": tasks[1], "progress": oldProgress[1], "limit": limits[1]},
                {"scenario": 3, "task": tasks[2], "progress": oldProgress[2], "limit": limits[2]}]
    if not tasksArr:
        flash("Tasks not loaded")
    else:
        todoList = dict()
        for i, task in enumerate(tasksArr):
            todoList[i] = task["task"] + msgAppend[i]
    return jsonify(reset=reset, list=todoList, scores=progress, limits=limits, attempts=totalAttempts,
                   playerCount=uniqueAttempts)


@app.route('/reset-tasks', methods=["POST"])
def reset_tasks():
    for i in range(len(progress)):
        progress[i] = 0
        oldProgress[i] = 0
    global reset
    reset = True
    for i in range(len(resetConfirmed)):
        resetConfirmed[i] = False
    return "Success"


@app.route('/confirm-reset', methods=["POST"])
def confirm_reset():
    taskID = get_val("task")
    resetConfirmed[taskID] = True
    if False not in resetConfirmed:  # As all clients have reset
        print("Reset complete")
        resetVals()
    return "Woo"


def resetVals():
    global progress, limits, players, lastPlayers, totalAttempts, uniqueAttempts, msgAppend, oldProgress, reset
    progress = [0, 0, 0]
    limits = [3, 3, 3]
    players = ["", "", ""]
    lastPlayers = [[""], [""], [""]]
    totalAttempts = [0, 0, 0]
    uniqueAttempts = [0, 0, 0]
    msgAppend = ["", "", ""]
    oldProgress = [-1, -1, -1]
    reset = False


@app.route('/reset-timers', methods=["POST"])
def reset_timers():
    resetVals()
    return "reset"


@app.route('/reset-leaderboards', methods=["POST"])
def reset_leaderboards():
    emptyLeaderboard = [["AAA", 999], ["AAA", 999], ["AAA", 999]]
    for task in taskOpts:
        file = join(dirname(realpath(__file__)), "static/leaders/" + task + ".leaders")
        with open(file, 'w') as f:
            for entry in emptyLeaderboard:
                if task == "danceScores":
                    f.write(entry[0] + ",0\n")
                else:
                    f.write(entry[0] + "," + str(entry[1]) + "\n")


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
