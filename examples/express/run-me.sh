#!/bin/bash


../../cli.js clean &>/dev/null
touch swagger.json

node server.js &>/dev/null &
# give time to the server to come up
# TODO, can we improve this using expect?
sleep 2
pid=$!

../../node_modules/.bin/mocha test-with-extract.js
# ../../node_modules/.bin/mocha test-with-probe.js

../../cli.js doc
../../cli.js serve

kill $pid
