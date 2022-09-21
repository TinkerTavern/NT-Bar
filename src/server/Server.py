import socket
from os.path import join, dirname, realpath

from flask import Flask, render_template, request, jsonify, flash
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
progress = [0, 0, 0]
limits = [20, 3, 3]
players = ["", "", ""]
msgAppend = ["", "", ""]
taskOpts = ["danceScores", "riddleScores", "puzzleScores"]
tasks = ["Master the dance", "Solve " + str(limits[2]) + " riddles",
         "Solve " + str(limits[1]) + " sliding puzzles"]
oldProgress = [-1, -1, -1]

# TODO: Think about how to get a room reset button working effectively
# Send signal to client which sets localStorage flag to true, then in each of the in game timers, check for flag and if true, trigger restart
# TODO: Find a way to stream/show screenshots of the player's games on server side
# TODO: See below, need more stats on main screen
"""
Per game: Display count of number of players so far
Per game: Display count of number of attempts
DONE Per game: Leaderboard with High Score (or shortest session time to solve)
DONE Per game: current session length
Per game: current time since new player
"""


def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        # doesn't even have to be reachable
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
    return jsonify(ping="pong")

@app.route('/')
def hello_world():
    return render_template("server.html", ip=get_ip())


@app.route("/get-ip", methods=["GET"])
def get_my_ip():
    print(request.remote_addr)
    return jsonify({'ip': request.remote_addr}), 200


@app.route("/update", methods=["POST"])
def update_task():
    limit = request.form.get("limit")
    taskID = request.form.get("task")
    progressVal = request.form.get("progress")
    if taskID is None:
        limit = request.json.get("limit")
        taskID = request.json.get("task")
        progressVal = request.json.get("progress")
    if limit is not None:
        limits[int(taskID)] = limit
    progress[int(taskID)] = progressVal
    return jsonify(success=True)


@app.route("/submit", methods=["POST"])
def submit_score():
    user = request.form.get("user")
    taskID = request.form.get("task")
    time = request.form.get("time")
    if taskID is None:
        user = request.json.get("user")
        taskID = request.json.get("task")
        time = request.json.get("time")
    file = join(dirname(realpath(__file__)), "static/leaders/" + taskOpts[int(taskID)] + ".leaders")
    leaderboard = []
    print(user, time)
    import csv
    with open(file, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            leaderboard.append(row)
    print(leaderboard)
    for i, entry in enumerate(leaderboard):
        if (taskID == 2 and int(time) < int(entry[1])) or int(time) > int(entry[1]):
            leaderboard.insert(i, [user, time])
            del leaderboard[-1]
            break
    print(leaderboard)
    with open(file, 'w') as f:
        for entry in leaderboard:
            f.write(entry[0] + "," + str(entry[1]) + "\n")
    return jsonify(success=True)


@app.route("/set-user", methods=["POST"])
def set_user():
    user = request.form.get("user")
    taskID = request.form.get("task")
    if taskID is None:
        user = request.json.get("user")
        taskID = request.json.get("task")
    players[int(taskID)] = user
    for i, player in enumerate(players):
        if player != "":
            msgAppend[i] = " " + player + " is currently playing."
        else:
            msgAppend[i] = ""

    return jsonify(success=True)


@app.route('/pause-timer', methods=["POST"])
def pauseTimer():
    taskID = request.form.get("task")
    if taskID is None:
        user = request.json.get("user")
        taskID = request.json.get("task")


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
            todoList[i] = task["task"] + ". Progress: " + str(task["progress"]) + "/" + str(
                task["limit"]) + msgAppend[i]
    return jsonify(list=todoList, scores=progress, limits=limits)


@app.route('/reset-tasks', methods=["POST"])
def reset_tasks():
    for i in range(len(progress)):
        progress[i] = 0
        oldProgress[i] = 0
    return "Success"


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
