# CS3219 Assignment 2 

A web application with a frontend and backend, using two different kinds of databases (NoSQL and SQL), with communication between the frontend and backend of the application with a RESTful API.

The following objectives are achieved:
- Creating and managing user profiles, with the capacity of CRUD actions
- User profiles are stored in a MySQL database (RDBMS)  
- A REST API is required to communicate user actions such as registering, deregistering, creating, and the update of profiles from the front-end to the back-end.
- Enhancement of the question repository from Assignment 1 by integrating the requirements of Assignment 1 into Assignment 2

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Set-up

### Navigate to the current project directory 

After cloning the project in your personal device, navigate the directory to ay2324s1-course-assessment-g33/assignments/assignment_2 using `cd` commands in the terminal.

Within the project directory, create an environment file (.env.local). You can request for the environment file containing our API secrets from our group over email, at woobt123@gmail.com.
This allows you to access mongoDB, Firebase, and AWS RDS servers.

In the project directory, you can run:

### `npm i`

This installs the necessary node module packages key to running the assignment.
Please ensure that your node version is set to version 16, with npm version set to version 8.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

On successful set-up, your browser should look as follows:
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/43572438-c073-48fc-b34f-21d7db7be55c)


### `npm run mongo`

Runs the question repository backend service, to allow CRUD of questions in the question repository.

### `npm run serve`

Runs the user profile backend service, to allow CRUD of user profiles in the platform.

## User Guide

### Authentication

- Click 'Signup' to create an account. You can use a sample email such as sample@mail.com, and a password of more than 6 characters/numbers will do. 
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/20d43de4-c58f-4846-acb5-fb89ef88ee6a)

- Ensure that both fields, password and password confirmation have the same value, else an error will be thrown
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/dc15014c-e441-4e06-a2c0-30c95d55ed95)

- Successful sign up will be as follows
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/0c73055a-affd-4f25-b977-2e0479737059)

- Thereafter login with your newly created account

- A successful login should bring you to the following page
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/0feae2bd-28b5-4293-bd8a-8f4d6982b29e)

- Thereafter, you can add, update, delete and view questions in your question bank as per assignment 1

### User Profile Management

- Click 'My Profile' to navigate to the profile management page
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/9a31033c-cd47-426a-a451-3531fc48cf29)

- On a fresh account/on deletion of profile details, you can create your profile by clicking on 'Create Profile'
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/f9d3bc1b-a6ed-4be8-b511-f74a62cc27c3)

- A successful profile creation can be shown as follows:
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/e20ac6e8-b1d3-4159-b60d-033d69499e40)

- On returning back to the profile page, you will see that the details have been updated accordingly on the UI
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/b05dfb9b-1608-432f-9d25-707c911eb49f)


## Requirements Fulfilled

- Users can sign up and register to be on the platform
- Users can log out from the platform
- Users can create a profile on the platform, in a database with data persistence
- Users can delete their profile from the platform
- Users can view their profile when they are using the application
- Users can update the profile when they are on the platform when they like
- Users can maintain the question repository from the question bank with data persistence (integrated from Assignment 1)
- System robustness includes users cannot share the same email as others (unique)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
