#!/bin/bash

set -x -e

currentHead=$(git symbolic-ref -q HEAD) ||
  currentHead=$(git rev-parse HEAD)
currentHead=${currentHead##refs/heads/}

git checkout -B gh-pages
cake -c build
sed -i '' -e '/game\.js/d' .gitignore
git add .gitignore game.js
git commit -m "Built for deployment"

git checkout $currentHead

git push -f origin gh-pages
