[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# AssignmentTemplate

# CS3219 Project

## Installation

### Backend

Go to each of the `backend` sub folders

- Run `pip install -r ./requirements.txt` in your virtual environment

### Frontend

Go to `frontend` folder

- Run `npm i` to install the required node modules

## Development

### Build

Run `docker-compose -f docker-compose-dev.yml build`

### Run

Run `bash start-dev-sh` in project root directory

Go to `backend/server` folder

- Run `bash run-dev.sh` to start server

Go to `backend/leetcode_service` folder

- Run `bash run-dev.sh` to start leetcode service

Go to `backend/question_service` folder

- run `bash run-dev.sh` to start question service

Go to `frontend` folder

- run `npm start` to start frontend application

## Deployment

### Build

Run `docker-compose -f docker-compose.yml build`

### Run

Run `bash start.sh` in project root directory
