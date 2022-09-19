from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("client.html")


@app.route('/item-catch')
def item_catch():
    return render_template("item-catch.html")


@app.route('/item-catch/config')
def item_catch_config():
    return render_template("item-catch-config.html")


@app.route('/tile-shift')
def tile_shift():
    return render_template("tile-shift.html")


@app.route('/tile_shift/config')
def tile_shift_config():
    return render_template("tile_shift-config.html")


@app.route('/cypher')
def cypher():
    return render_template("cypher.html")


@app.route('/cypher/config')
def cypher_config():
    return render_template("cypher-config.html")


@app.route('/riddle')
def riddle():
    return render_template("riddle.html")


@app.route('/riddle/config')
def riddle_config():
    return render_template("riddle-config.html")


@app.route('/reset')
def reset():
    print("reset")


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
