#!/bin/sh
cd ./src
echo "Transpiling Typescript code into Vanilla Javascript..."
tsc
cd ..
echo "Running electron app..."
npm run start