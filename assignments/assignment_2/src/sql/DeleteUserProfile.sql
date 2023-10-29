CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteUserProfile`(
	IN email VARCHAR(200)
)
BEGIN
	DELETE FROM users WHERE users.email = email;
END