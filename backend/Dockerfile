FROM python:3.10

WORKDIR /backend

COPY ./requirements.txt /backend/requirements.txt

RUN pip install -r requirements.txt

COPY ./app /backend/app
COPY ./run.sh /backend/run.sh

EXPOSE 5000

CMD bash run.sh
