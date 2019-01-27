help:
	@perl -ne 'print if /^[0-9a-zA-Z_-]+:.*?## .*$$/' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Builds the code
	docker-compose run builder
	docker-compose build web


run: ## Runs the code locally with docker-compose
	docker-compose up -d web

publish: build ## Builds and publishes the image with tag latest
	docker tag techielaweb_web gcr.io/te-chie-la/web:latest
	docker push gcr.io/te-chie-la/web:latest


stop: ## Stops the container running web
	docker-compose stop

.PHONY: help build run stop
