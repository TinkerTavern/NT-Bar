IF "%~1"=="1" (
  echo PUBLIC_URL= > .env
  echo REACT_APP_GAME_NAME=Cypher Cracker >> .env
  echo REACT_APP_GAME_TO_BUILD=cypher >> .env
) ELSE (
  echo PUBLIC_URL= > .env
  echo REACT_APP_GAME_NAME=Needlepoint >> .env
  echo REACT_APP_GAME_TO_BUILD=puzzle_shift >> .env
)
IF not exist "build" (
  mkdir "build"
)
cd "build" || exit
call npm run build
cd ..
python .\moveFiles.py