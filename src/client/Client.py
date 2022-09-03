from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("home.html")

@app.route('/item-catch')
def item_catch():
    return render_template("item-catch.html")

@app.route('/tile-shift')
def tile_shift():
    return render_template("tile-shift.html")

@app.route('/cypher')
def cypher():
    return render_template("cypher.html")

@app.route('/riddle')
def riddle():
    return render_template("riddle.html")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
