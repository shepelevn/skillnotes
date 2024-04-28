#!/bin/bash

. config.sh

curl -i $CURL_HOSTNAME:$CURL_PORT$CURL_API_PREFIX/wrong-route \
  -b "./cookie-jar.txt" \
  | json
