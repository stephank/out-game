#!/bin/sh

set -x -e

currentHead=`git symbolic-ref HEAD`

git checkout -B gh-pages
cake -c build
sed -i '' -e '/game\.js/d' .gitignore
git add .gitignore game.js
git commit -m "Built for deployment"

git checkout $currentHead

git push origin gh-pages
