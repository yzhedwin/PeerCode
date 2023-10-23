CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertUserProfile`(
	IN email VARCHAR(200),
    IN displayName VARCHAR(50),
    IN username VARCHAR(50),
    IN proficiency VARCHAR(50)
)
BEGIN
	INSERT INTO users(email, displayName, username, proficiency) VALUES (email, displayName, username, proficiency);
END