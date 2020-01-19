#!/bin/sh
cd ./src
echo "Transpiling Typescript code into Vanilla Javascript..."
tsc
cd ..
echo "Done!"
echo "Now building the electron app..."
npm run start
echo "Electron application have been closed!"