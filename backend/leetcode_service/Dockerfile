FROM python:3.10

WORKDIR /backend/leetcode_service
COPY ./requirements.txt /backend/leetcode_service/requirements.txt
RUN pip install -r requirements.txt
COPY . /backend/leetcode_service
COPY ./run.sh /backend/leetcode_service/run.sh
# CMD bash run.sh
