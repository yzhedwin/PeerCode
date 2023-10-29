# CS3219 Assignment 3

A web application that builds on top of the full-stack web application of assignment 2 (question repository and profile repository with CRUD), adding on authentication state management and authorisation functionality.

The following objectives are achieved:
- Full authentication capabilities with email and password (unique email).
- Users are able to create an account, login, logout, reset password, powered by Firebase's authentication and authorisation service.
- Certain users have elevated administrative roles (maintainers) who has privileges to update and delete questions in the question repository.
- Registered users are allowed to read questions from the question repository, but not add, update, or delete.
- Unauthenticated and unauthorised users (those who do not have an account) cannot access the question repository completely.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Set-up

### Navigate to the current project directory 

After cloning the project in your personal device, navigate the directory to ay2324s1-course-assessment-g33/assignments/assignment_3 using `cd` commands in the terminal.

Within the project directory, create an environment file (.env.local). You can request the environment file containing our API secrets from our group over email, at woobt123@gmail.com.
This allows you to access MongoDB, Firebase, and AWS RDS servers.

In the project directory, you can run:

### `npm i`

This installs the necessary node module packages key to running the assignment.
Please ensure that your node version is set to version 16, with the npm version set to version 8.

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

- To reset your password, click on 'Forget Password' on the log in page
- Key in your email that you can access, to receive the password reset email.
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/e30398ea-7043-4e3b-98fa-31bdf3dcb5a0)

- Click the link provided in the email to reset your password.
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/5accf894-f59b-4456-8b17-179cc67d6e67)

- To verify for authorisation, you can enter <i>http://localhost:3000/profile</i>. If you are not authorised, you will see the following page.
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/d8a8117d-3683-433d-bc9c-3896e415e814)


### Management of Elevated Priorities

- Normal registered users would not have the ability to add, update, and delete questions from the question repository. However, they would be able to view the questions in the repository.
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/1961d64a-a276-4c4b-a653-f193237253d4)

- Admins (users with elevated priorities) would have the ability to add, update, and delete questions.
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/633a3131-ebdc-44d8-bb9f-006decc9a192)
- The priority can be assigned within Firebase itself, by setting the user's 'role' parameter to true. The users can be identified by Firebase's auto-assigned UUID.
![image](https://github.com/Bobowoo2468/ay2324s1-course-assessment-g33/assets/62021897/70eea334-bece-4c47-8dfd-ae348a42da76)


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
