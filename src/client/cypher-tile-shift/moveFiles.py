import os
import shutil
import sys
from os import path


def rmdirIfExists(dir):
    if path.exists(dir):
        try:
            os.rmdir(dir)
        except OSError:
            shutil.rmtree(dir)


def renameIfExists(dir, newName):
    if path.exists(dir):
        os.rename(dir, newName)


if __name__ == "__main__":
    os.chdir("build")
    if len(sys.argv) > 1 and sys.argv[1] == "1":
        if path.exists('../../templates/tile-shift.html'):
            os.remove('../../templates/tile-shift.html')
        renameIfExists("index.html", "cypher.html")
    else:
        if path.exists('../../templates/cypher.html'):
            os.remove('../../templates/cypher.html')
        renameIfExists("index.html", "tile-shift.html")

    rmdirIfExists("../../static/css")
    rmdirIfExists("../../static/js")
    rmdirIfExists("../../static/media")
    shutil.copytree("static", "../../static", dirs_exist_ok=True)
    rmdirIfExists("static")
    shutil.copytree(".", "../../templates/", dirs_exist_ok=True)
