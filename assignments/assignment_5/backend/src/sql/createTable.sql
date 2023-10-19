CREATE DATABASE peerPrepAssignment;
USE peerPrepAssignment;

CREATE TABLE users (
    UserID INT AUTO_INCREMENT NOT NULL,
    Email VARCHAR(50) NOT NULL,
    DisplayName VARCHAR(50),
    Username VARCHAR(50), 
    Proficiency VARCHAR(50),
    CONSTRAINT UC_Users UNIQUE (UserID, Email)
);

SELECT * FROM users;