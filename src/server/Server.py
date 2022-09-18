from flask import Flask, render_template, request, jsonify, flash
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
progress = [0, 0, 0]
limits = [20, 3, 3]
players = ["", "", ""]
msgAppend = ["", "", ""]

tasks = ["Master the dance", "Solve " + str(limits[2]) + " riddles",
         "Solve " + str(limits[1]) + " sliding puzzles"]
oldProgress = [-1, -1, -1]


@app.route('/')
def hello_world():
    return render_template("server.html")


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
    print("kkk")
    return "Success"


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
