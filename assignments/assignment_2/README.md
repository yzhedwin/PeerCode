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

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

On successful set-up, your browser should look as follows:
![image](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g33/assets/62021897/4ca66719-dbfd-4f72-ae40-4ab92bc98690)

### `npm run mongo`

Runs the question repository backend service, to allow CRUD of questions in the question repository.

### `npm run serve`

Runs the user profile backend service, to allow CRUD of user profiles in the platform.

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
