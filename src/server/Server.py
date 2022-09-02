from flask import Flask, render_template, request, jsonify, flash
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
progress = [0, 0, 0]
limits = [20, 3, 3]
tasks = ["Collect " + str(limits[0]) + " artefacts", "Solve " + str(limits[1]) + " sliding puzzles",
         "Solve " + str(limits[2]) + " riddles"]
oldProgress = [-1, -1, -1]


@app.route('/')
def hello_world():
    return render_template("home.html")


@app.route("/update", methods=["POST"])
def update_task():
    limit = request.form.get("limit")
    taskID = request.form.get("task")
    progressVal = request.form.get("progress")
    if taskID is None:
        taskID = request.json.get("task")
        progressVal = request.json.get("progress")
    if limit is not None:
        limits[int(taskID)] = limit
    progress[int(taskID)] = progressVal
    return jsonify(success=True)


@app.route('/get-tasks', methods=["GET"])
def index():
    if progress == oldProgress:
        return jsonify(list="old")
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
            todoList[i] = task["task"] + ". Progress: " + str(task["progress"]) + "/" + str(task["limit"])
    return jsonify(list=todoList)


@app.route('/reset-tasks', methods=["POST"])
def reset_tasks():
    for i in range(len(progress)):
        progress[i] = 0
        oldProgress[i] = 0
    return "Success"


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")