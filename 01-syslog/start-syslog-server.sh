#!/bin/sh
source ./vars

# create docker network if it doesn't exists
docker network inspect $NETWORK_NAME >/dev/null 2>&1 || \
    docker network create --driver bridge $NETWORK_NAME

# start fluentd container in daemon mode
docker run -d --network $NETWORK_NAME --name syslog -p 5140:5140 -p 5140:5140/udp \
    -ti --rm \
    -v ./data/fluentd:/fluentd/etc \
    fluent/fluentd:edge -c /fluentd/etc/config.conf -v
