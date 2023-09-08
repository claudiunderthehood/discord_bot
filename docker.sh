#!/usr/bin/env bash

BOT_NAME=""
IMAGE_TAG=""

if docker volume ls | grep $BOT_NAME
then
	echo "docker volume already exists"
else
	docker volume create $BOT_NAME
fi

docker stop $BOT_NAME && docker rm $BOT_NAME
docker rmi $IMAGE_TAG
docker build -t $IMAGE_TAG .
docker run --restart on-failure -d --name $BOT_NAME --memory="512m" --cpus="1" $IMAGE_TAG
