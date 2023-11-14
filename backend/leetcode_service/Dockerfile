FROM python:3.10

WORKDIR /backend/leetcode_service

RUN apt-get update
COPY . /backend/leetcode_service
RUN pip install -r requirements.txt

CMD bash run.sh
