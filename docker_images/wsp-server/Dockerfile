FROM ubuntu:22.04

MAINTAINER benson

WORKDIR /root/
ADD ./requirements.txt /root/

ENV TZ="Asia/Taipei"
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get -y update && apt-get -y upgrade

RUN apt-get install -y --no-install-recommends tzdata \
&& ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
&& echo $TZ > /etc/timezone \
&& dpkg-reconfigure -f noninteractive tzdata 

RUN apt-get install -y apache2 libapache2-mod-evasive \
&& apt-get install -y gcc make wget

# Build source code pyhton and install pip
RUN apt-get install -y build-essential zlib1g-dev libncurses5-dev \
libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev

RUN wget https://www.python.org/ftp/python/3.8.10/Python-3.8.10.tar.xz \ 
&& tar Jxvf ./Python-3.8.10.tar.xz \
&& rm ./Python-3.8.10.tar.xz \
&& mv ./Python-3.8.10 /opt/ \
&& cd /opt/Python-3.8.10/ \
&& ./configure \ 
&& make \
&& make install \
&& ln -fs /usr/local/bin/python3 /usr/local/bin/python

RUN wget https://bootstrap.pypa.io/get-pip.py \
&& python get-pip.py \
&& rm get-pip.py

# install openCV dependency library
RUN python -m pip install -r requirements.txt \ 
&& rm requirements.txt \ 
&& apt-get install -y ffmpeg libsm6 libxext6

# install php
RUN apt-get install -y php php-common php-curl \
php-xml php-zip php-gd php-mysql php-mbstring

# RUN useradd -u 1000 -ms /bin/bash wsp && usermod -aG sudo wsp
# USER wsp

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]
