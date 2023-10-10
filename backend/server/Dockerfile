FROM python:3.10

WORKDIR /backend/server

COPY ./requirements.txt /backend/server/requirements.txt

RUN pip install -r requirements.txt

COPY . /backend/server
COPY ./run.sh  /backend/server/run.sh

EXPOSE 5000
CMD bash run.sh
