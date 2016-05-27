#!/bin/bash

:>swagger.json

node server.js &>/dev/null &
# give time to the server to come up
# TODO, can we improve this using expect?
sleep 2
pid=$!

../../node_modules/.bin/mocha test.js # &>/dev/null

kill $pid
