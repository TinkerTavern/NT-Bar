import os
from pathlib import Path


def createExe(venvDir, buildDir, appDir, dataDirs, appName):
    os.chdir(venvDir + '/Scripts')
    os.system('activate.bat')
    os.chdir('../../')
    if not os.path.exists(buildDir):
        os.mkdir(buildDir)
    os.chdir(buildDir)
    cmd = 'python -m PyInstaller --onefile'
    for dir in dataDirs:
        dirStr = ' --add-data "' + str(Path('../' + dir).resolve())
        dirStr += ';' + dirStr.split("\\")[-1] + '"'
        cmd += dirStr
    cmd += ' ../' + appDir + '/app.py'
    print(cmd)
    os.system(cmd)
    appName = "./dist/"+appName+".exe"
    if os.path.exists(appName):
        os.remove(appName)
    os.rename("./dist/app.exe", appName)
    os.chdir("../")


if __name__ == '__main__':
    createExe('venv', 'client_build', 'src/client', ['src/client/static', 'src/client/templates'], 'nt-client')
    createExe('venv', 'server_build', 'src/server', ['src/server/static', 'src/server/templates'], 'nt-server')
