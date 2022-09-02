from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("home.html")

@app.route('/snake-catch')
def snake_catch():
    return render_template("snake-catch.html")

@app.route('/tile-shift')
def tile_shift():
    return render_template("tile-shift.html")

@app.route('/riddle')
def riddle():
    return render_template("riddle.html")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
