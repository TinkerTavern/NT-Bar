IF "%~1"=="1" (
  echo PUBLIC_URL= > .env
  echo REACT_APP_GAME_NAME=Cypher Cracker >> .env
  echo REACT_APP_GAME_TO_BUILD=cypher >> .env
) ELSE (
  echo PUBLIC_URL= > .env
  echo REACT_APP_GAME_NAME=Tile Shift >> .env
  echo REACT_APP_GAME_TO_BUILD=puzzle_shift >> .env
)
IF not exist "build" (
  mkdir "build"
)
cd "build" || exit
npm run build
IF "%~1"="1" (
  IF "-f" "..\..\templates\tile-shift.html" (
    DEL  "..\..\templates\tile-shift.html"
  )
  mv .\index.html .\cypher.html
) ELSE (
  IF "-f" "..\..\templates\cypher.html" (
    DEL  "..\..\templates\cypher.html"
  )
  mv .\index.html .\tile-shift.html
)
rm -r ..\..\static\css
rm -r ..\..\static\js
rm -r ..\..\static\media
mv .\static\* ..\..\static\
rmdir .\static
mv -Force .\* ..\..\templates\