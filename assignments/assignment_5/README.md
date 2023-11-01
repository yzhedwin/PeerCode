# CS3219 Assignment 5

A web application with a frontend and backend, using RabbitMQ as a Message Queue for matchmaking service.

The following objectives are achieved:

- Let the user match using RabbitMQ, a queuing technology under AMQP.
- Develop a front-end that communicates with the back-end for matching services.
- Enhancement of the front-end by integrating the front end from Assignment 2 into Assignment 5, using the auth. 

This project was created using the front-end from Assignment 2

## Set-up

### Navigate to the current project directory

After cloning the project in your personal device, navigate the directory to ay2324s1-course-assessment-g33/assignments/assignment_5 using `cd` commands in the terminal.

There are two folders, `backend` and `frontend`.

### Backend

Within the project directory, create an environment file `.env` by making a copy of `.env.example`. You can request for the environment file containing our API secrets from our group over email, at woobt123@gmail.com.
This allows you to access RabbitMQ and sets the matchmaking timeout.

#### `npm i`

This installs the necessary node module packages key to running the assignment.
Please ensure that your node version is set to version 16, with npm version set to version 8.

#### `npm run match`

Runs the matchmaking backend service, to allow set up the RabbitMQ communications.

#### `npm run sock`

Runs the matchmaking socket backend service, to allow communication between the server and client.

### Frontend

Within the project directory, create an environment file `.env` by making a copy of `.env.example`. You can request for the environment file containing our API secrets from our group over email, at woobt123@gmail.com.
This allows you to access Firebase and sets the matchmaking timeout.

In the project directory, you can run:

#### `npm i`

This installs the necessary node module packages key to running the assignment.
Please ensure that your node version is set to version 16, with npm version set to version 8.

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

On successful set-up, your browser should look as follows:
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/43572438-c073-48fc-b34f-21d7db7be55c)

## User Guide

### Authentication

Please refer to [Assignment 2's user guide for authentication](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g33/blob/master/assignments/assignment_2/README.md)

### Matching

After the user is logged in, he will be presented with three buttons to show which queue he wants to be match in.

![home](https://github.com/francisyzy/ay2324s1-course-assessment-g33/assets/24467184/7e759252-7982-44a7-928f-7e9dd7ad7c1f)

The matching is currently set to 5s for demonstration purposes.

![matching](https://github.com/francisyzy/ay2324s1-course-assessment-g33/assets/24467184/102fa5b7-6260-4a9a-8ea7-b06b616b750b)

After a successful match, the match code/room will be shown.

![matched](https://github.com/francisyzy/ay2324s1-course-assessment-g33/assets/24467184/b88ace61-a807-4f65-bbf4-aa07aaa0b0fb)

If no matches are found, message will be shown to the user.

![fail](https://github.com/francisyzy/ay2324s1-course-assessment-g33/assets/24467184/b2194ca5-0f4d-46f0-96e8-018b06939449)

## Requirements Fulfilled

- Demonstrating the two users’ inputs to specify the criteria for matching
- Front-end timer + feedback + handling no match
- Demonstrating the valid matching
- Containerizing the application

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn RabbitMQ, check out the [RabbitMQ documentation](https://www.rabbitmq.com/documentation.html).
