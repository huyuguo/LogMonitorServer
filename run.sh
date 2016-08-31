#!/bin/bash

pid=`sed -n 1p pid.txt`
kill -9 $pid

nohup node server.js &