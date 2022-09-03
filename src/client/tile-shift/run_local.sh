#!/bin/bash
if [ $1 -eq 1 ]
then
    printf "PUBLIC_URL=\nREACT_APP_GAME_NAME=Cypher Cracker\nREACT_APP_GAME_TO_BUILD=cypher" > .env
else
    printf "PUBLIC_URL=\nREACT_APP_GAME_NAME=Tile Shift\nREACT_APP_GAME_TO_BUILD=puzzle_shift" > .env
fi
mkdir build
cd build
npm install
npm run build
npm install -g serve
if [ $1 -eq 1 ]
then
    rm ../../templates/tile-shift.html
    mv index.html cypher.html
else
    rm ../../templates/cypher.html
    mv index.html tile-shift.html
fi
rm -rf ../../static/css
rm -rf ../../static/js
rm -rf ../../static/media
mv static/* ../../static/
rmdir static
mv * ../../templates/
