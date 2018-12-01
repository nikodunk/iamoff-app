

CREATE TABLE users (
	uid bigint primary key,
	phone bigint,
	name text,
	pin int,
	usergroup text,
	firstrun,
	token text );


	create:
	INSERT INTO users VALUES (1, 4154444444, 'Sarah Mango', 8523);
	INSERT INTO users VALUES (2, 9177043031, 'Niko Dunk', null);

	read:
	SELECT * FROM users WHERE phone = 4154444444;

	update:
	UPDATE users SET uid, phone, name, PIN  = 4154444444, 4154444444, 'Sarah Mango', 8523 where uid = 4154444444;
	UPDATE users SET usergroup  = 'Stanford-1';
	UPDATE users SET usergroup  = 'Stanford IM 2021' WHERE usergroup = 'Stanford-2021';



	delete:
	DANGER DELETE FROM users WHERE uid = 1;


	heroku pg:psql       \q


useful commands:

	ALTER TABLE users ADD COLUMN token text;

	select usergroup, count(*), count(token) from users GROUP BY usergroup order by count(*) desc;

	select count(*) from users where token is not null;