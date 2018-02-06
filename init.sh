#!/bin/bash

mkdir /var/cache/Bot
mkdir /var/cache/Bot/collection
apt-get update
apt-get install git vim mongodb npm
service mongodb start
npm install n -g
n stable