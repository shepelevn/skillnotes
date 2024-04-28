#!/bin/bash

. config.sh

curl -i $CURL_HOSTNAME:$CURL_PORT$CURL_API_PREFIX/notes?age=$1'&'page=$2 \
  -b "./cookie-jar.txt" \
  | json
