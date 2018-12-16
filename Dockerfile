FROM ubuntu:18.10
MAINTAINER franhp@te.chie.la

RUN apt-get -y update
RUN apt-get -y install \
    curl \
    git \
    mercurial \
    build-essential \
    ruby-dev \
    compass-blueprint-plugin \
    npm \
    nodejs \
    golang

RUN gem install compass

# Install hugo
ENV GOPATH $HOME/go
ENV PATH $PATH:$GOROOT/bin:$GOPATH/bin
RUN go get github.com/gohugoio/hugo

# Install build dependencies
WORKDIR /src/
ENV PATH /src/node_modules/.bin/:$PATH

CMD npm install && \
    bower install --allow-root --config.interactive=false && \
     grunt prod
