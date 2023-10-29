CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserProfile`(
		IN email VARCHAR(200)
	)
BEGIN
	SELECT * from users 
    WHERE users.email = email;
END