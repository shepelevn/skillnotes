#!/bin/bash

. config.sh

curl -i -X POST $CURL_HOSTNAME:$CURL_PORT$CURL_API_PREFIX/notes/$1/unarchive \
  -b "./cookie-jar.txt" \
  | json
