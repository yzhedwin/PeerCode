# CS3219 Assignment 5

A web application with a frontend and backend, using RabbitMQ as a Message Queue for matchmaking service.

The following objectives are achieved:

<!-- - Creating and managing user profiles, with the capacity of CRUD actions
- User profiles are stored in a MySQL database (RDBMS)
- A REST API is required to communicate user actions such as registering, deregistering, creating, and the update of profiles from the front-end to the back-end.
- Enhancement of the question repository from Assignment 1 by integrating the requirements of Assignment 1 into Assignment 2 -->

This project was created from Assignment 2

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

Please refer to [Assignment 2's user guide for authentication](#TODO)

### Matching

<!-- TODO -->

## Requirements Fulfilled

<!-- TODO -->

<!-- - Users can sign up and register to be on the platform
- Users can log out from the platform
- Users can create a profile on the platform, in a database with data persistence
- Users can delete their profile from the platform
- Users can view their profile when they are using the application
- Users can update the profile when they are on the platform when they like
- Users can maintain the question repository from the question bank with data persistence (integrated from Assignment 1)
- System robustness includes users cannot share the same email as others (unique) --> -->

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn RabbitMQ, check out the [RabbitMQ documentation](https://www.rabbitmq.com/documentation.html).
