CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateUserProfile`(
	IN email VARCHAR(200),
    IN displayName VARCHAR(50),
    IN username VARCHAR(50),
    IN proficiency VARCHAR(50)
)
BEGIN
	UPDATE users
    SET users.displayName = displayName, users.username = username, users.proficiency = proficiency
    WHERE users.email = email;
END