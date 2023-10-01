CREATE DATABASE PeerPrepAssignment;
USE PeerPrepAssignment;

CREATE TABLE users (
    UserID INT AUTO_INCREMENT NOT NULL,
    Email NVARCHAR(50) NOT NULL,
    DisplayName NVARCHAR(50),
    Username NVARCHAR(50), 
    Proficiency INT
);

SELECT * FROM users;