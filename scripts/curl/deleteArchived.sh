#!/bin/bash

. config.sh

curl -i -X DELETE $CURL_HOSTNAME:$CURL_PORT$CURL_API_PREFIX/notes/archived \
  -b "./cookie-jar.txt" \
  | json
