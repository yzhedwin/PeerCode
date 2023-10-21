CREATE DATABASE peerPrepAssignment;
USE peerPrepAssignment;

CREATE TABLE users (
    Email VARCHAR(50) UNIQUE NOT NULL,
    DisplayName VARCHAR(50),
    Username VARCHAR(50), 
    Proficiency VARCHAR(50),
);

SELECT * FROM users;