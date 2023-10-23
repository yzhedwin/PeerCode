CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserProfile`(
		IN email VARCHAR(200)
	)
BEGIN
	SELECT * from users 
    WHERE email = email;
END