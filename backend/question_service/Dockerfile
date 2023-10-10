FROM python:3.10

WORKDIR /backend/question_service
COPY ./requirements.txt /backend/question_service/requirements.txt

RUN pip install -r requirements.txt
COPY . /backend/question_service
COPY ./run.sh  /backend/question_service/run.sh

EXPOSE 5001
CMD bash run.sh
