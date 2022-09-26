#!/bin/bash
if [ $1 -eq 1 ]; then
  printf "PUBLIC_URL=\nREACT_APP_GAME_NAME=Cypher Cracker\nREACT_APP_GAME_TO_BUILD=cypher" >.env
else
  printf "PUBLIC_URL=\nREACT_APP_GAME_NAME=Needlepoint\nREACT_APP_GAME_TO_BUILD=puzzle_shift" >.env
fi
if [ ! -d build ]; then
mkdir build
fi
cd build || exit
npm run build
if [ $1 -eq 1 ]; then
  if [ -f ../../templates/tile-shift.html ]; then
    rm ../../templates/tile-shift.html
  fi
  mv index.html cypher.html
else
  if [ -f ../../templates/cypher.html ]; then
    rm ../../templates/cypher.html
  fi
  mv index.html tile-shift.html
fi
rm -rf ../../static/css
rm -rf ../../static/js
rm -rf ../../static/media
mv static/* ../../static/
rmdir static
mv * ../../templates/
