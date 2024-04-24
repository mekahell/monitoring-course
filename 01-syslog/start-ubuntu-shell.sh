#!/bin/sh
source ./vars

# start ubuntu container in daemon mode
docker run --network $NETWORK_NAME --name console -it --rm ubuntu:jammy bash

# logger --server syslog -p warning -P 5140 -d --tag 'valeur' --sd-id user@123 --sd-param application=\"webservice\" hellobis