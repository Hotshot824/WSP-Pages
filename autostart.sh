#! /bin/bash
WD=$(dirname $(readlink -f $0));
cd ${WD};
docker-compose up;