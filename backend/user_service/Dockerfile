FROM python:3.10

WORKDIR /backend/user_service
COPY ./requirements.txt /backend/user_service/requirements.txt

RUN pip install -r requirements.txt
COPY . /backend/user_service
COPY ./run.sh  /backend/user_service/run.sh

EXPOSE 5003
CMD bash run.sh
