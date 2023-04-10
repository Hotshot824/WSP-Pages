FROM ubuntu:22.04
MAINTAINER benson
# This Dockerfile is a self-compiled version of tensorflow. 
# If the CPU does not support tensorflow 2.6.0, use this Dockerfile to compile the image.

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
&& make -j $(nproc) && make install -j $(nproc)
RUN ln -fs /opt/Python-3.8.10/python /usr/local/bin/python

# Install Python and the TensorFlow package dependencies
RUN apt-get install -y python3-dev python3-pip
RUN python -m pip install pip wheel packaging requests opt_einsum 
RUN python -m pip install keras_preprocessing --no-deps

# Install OpenCV dependency library
RUN python -m pip install -r requirements.txt \ 
&& rm requirements.txt \ 
&& apt-get install -y ffmpeg libsm6 libxext6

# Install Bazel
RUN apt-get install -y apt-transport-https curl gnupg git \
&& curl -fsSL https://bazel.build/bazel-release.pub.gpg | gpg --dearmor >bazel-archive-keyring.gpg \
&& mv bazel-archive-keyring.gpg /usr/share/keyrings \
&& echo "deb [arch=amd64 signed-by=/usr/share/keyrings/bazel-archive-keyring.gpg] https://storage.googleapis.com/bazel-apt stable jdk1.8" | tee /etc/apt/sources.list.d/bazel.list

RUN apt-get -y update && apt-get install -y bazel-3.7.2 \
&& ln -fs /usr/bin/bazel-3.7.2 /usr/bin/bazel

RUN apt-get install -y openjdk-11-jdk

RUN cd /tmp && git clone https://github.com/tensorflow/tensorflow.git \
&& cd tensorflow && git checkout r2.6

WORKDIR /tmp/tensorflow/
RUN ./configure
RUN bazel build --config=opt --jobs $(nproc) //tensorflow/tools/pip_package:build_pip_package
RUN ./bazel-bin/tensorflow/tools/pip_package/build_pip_package /tmp/tensorflow_pkg
RUN python -m pip install /tmp/tensorflow_pkg/*.whl

WORKDIR ~
RUN rm -rf /tmp/*

# Install PHP
RUN apt-get install -y php php-common php-curl \
php-xml php-zip php-gd php-mysql php-mbstring

# RUN useradd -u 1000 -ms /bin/bash wsp && usermod -aG sudo wsp
# USER wsp

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]
