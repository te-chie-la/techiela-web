#!/usr/bin/env bash
docker-compose stop server
docker-compose up letsencrypt
docker-compose up -d server
