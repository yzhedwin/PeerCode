CREATE PROCEDURE `DeleteUserProfile`(
	IN email VARCHAR(200)
)
BEGIN
	DELETE FROM users WHERE email = email;
END