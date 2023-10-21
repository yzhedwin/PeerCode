CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCurrentUserProfile`(
		IN email VARCHAR(200)
	)
BEGIN
	SELECT * from users 
    WHERE email = email;
END