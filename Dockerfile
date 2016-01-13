FROM ubuntu:15.10
MAINTAINER franhp@te.chie.la

RUN apt-get -y update
RUN apt-get -y install \
    curl \
    git \
    mercurial \
    build-essential \
    python-pip \
    ruby-dev \
    ruby-compass \
    npm \
    nodejs-legacy \
    golang


# Install hugo
ENV GOPATH $HOME/go
ENV PATH $PATH:$GOROOT/bin:$GOPATH/bin
RUN go get github.com/spf13/hugo

# Install build dependencies
WORKDIR /src/

ADD package.json /src/package.json
RUN npm install
ENV PATH /src/node_modules/.bin:$PATH

ADD bower.json /src/bower.json
RUN bower install --allow-root

ADD requirements.txt /src/requirements.txt
RUN pip install -r requirements.txt

CMD ["grunt", "prod"]
