#!/bin/bash

echo "Pull Initiated"

sudo git pull

echo "Pull Completed"

echo "Installing Npms"

cd ../

sudo npm install

echo "Npms Installed"

echo "Creating Build"

sudo npm run build

echo "Build Created"

echo "Done !!!"

exit