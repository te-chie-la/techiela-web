FROM ubuntu:15.10
MAINTAINER franhp@te.chie.la

RUN apt-get -y update && apt-get -y upgrade
RUN apt-get -y install \
    curl \
    git \
    mercurial \
    build-essential \
    python-setuptools \
    ruby-dev \
    ruby-compass \
    npm \
    nodejs-legacy \
    golang \
    lighttpd
RUN easy_install pip


# Install hugo
ENV GOPATH $HOME/go
ENV PATH $PATH:$GOROOT/bin:$GOPATH/bin
RUN go get github.com/spf13/hugo

# Install build dependencies
WORKDIR /src/

ADD package.json /src/package.json
RUN npm install
ENV PATH node_modules/.bin:$PATH

ADD bower.json /src/bower.json
RUN bower install --allow-root

ADD requirements.txt /src/requirements.txt
RUN pip install -r requirements.txt

# Finally copy the code over
ADD . /src/

RUN grunt dev
# Prod?


# Configure lighttpd and expose it
RUN sed -i 's/\/var\/www\/html/\/src\/app\/public/' /etc/lighttpd/lighttpd.conf

EXPOSE 80

ENTRYPOINT ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
