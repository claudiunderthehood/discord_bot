#!/usr/bin/env bash

git pull

DEPLOY_FOLDER=/etc/deploy.d
DEPLOY_FILE=""

if [ ! -d $DEPLOY_FOLDER ]
then
   mkdir -p $DEPLOY_FOLDER
fi

if docker ps | grep botname
then
  if test -f "$DEPLOY_FILE"; then
    echo "INFO: $DEPLOY_FILE exists..."
    git rev-parse HEAD > /tmp/deploy_check

    if diff -ruw /tmp/deploy_check $DEPLOY_FILE
    then
      echo "INFO: Nothing to do"
    else
      echo "INFO: deploy new hash"
        git rev-parse HEAD > $DEPLOY_FILE
      ${PWD}/docker.sh
    fi
  else
    echo "INFO: $DEPLOY_FILE does not exists, first deploy..."
    touch $DEPLOY_FILE
    git rev-parse HEAD > $DEPLOY_FILE

    ${PWD}/docker.sh
  fi
else
  echo "INFO: docker botname not exists, first deploy..."
  ${PWD}/docker.sh
fi
