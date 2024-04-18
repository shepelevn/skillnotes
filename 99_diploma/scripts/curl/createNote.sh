#!/bin/bash

. config.sh

curl -i -X POST $CURL_HOSTNAME:$CURL_PORT$CURL_API_PREFIX/notes \
  -H "Content-Type: application/json" \
  -d '{ "title": "'"${1}"'", "text": "'"${2}"'" }' \
  -b "./cookie-jar.txt" \
  | json
