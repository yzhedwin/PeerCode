[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# AssignmentTemplate

# CS3219 Project

## Installation

### Backend

Go to `backend` folder

- Run `pip install -r ./requirements-dev.txt` in your virtual environment. We are using this compiled requirements file for development so its easier to manage without the hassle of creating multiple environments.

### Frontend

Go to `frontend` folder

- Node version - 16.18.0

- Run `npm i` to install the required node modules

## Development

### Build

Rename `example-docker-compose.env` to `docker-compose.env`

Run `docker-compose -f docker-compose-dev.yml build`

### Run

Run `bash start-dev.sh` in project root directory

Go to `backend/` folder

- Run `bash run-dev.sh` in each of the subfolders to start all services

Go to `frontend` folder

- run `npm start` to start frontend application

## Deployment

### Build

Run `docker-compose -f docker-compose.yml build`

### Run

Run `bash start.sh` in project root directory
