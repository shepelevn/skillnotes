#!/bin/bash

. config.sh

curl -i -X POST $CURL_HOSTNAME:$CURL_PORT/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-raw "username=${1}&password=${2}" \
  -c './cookie-jar.txt'
