#!/bin/bash

. config.sh

curl -i -X PUT $CURL_HOSTNAME:$CURL_PORT$CURL_API_PREFIX/notes/$1 \
  -H "Content-Type: application/json" \
  -d '{ "title": "'"${2}"'", "markdown": "'"${3}"'" }' \
  -b "./cookie-jar.txt" \
  | json
