#!/bin/bash

. config.sh

curl -i -X DELETE $CURL_HOSTNAME:$CURL_PORT$CURL_API_PREFIX/notes/$1 \
  -b "./cookie-jar.txt" \
  | json
