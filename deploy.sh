#!/bin/bash

echo "git pull..."
git checkout main
git pull origin main

echo "build react..."
npm run build

echo "update done!"
