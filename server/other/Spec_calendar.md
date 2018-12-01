

CREATE TABLE calendar (
    Date Date,
    uid_off bigint,
    status text,
    notified int
    );


	add:
	INSERT INTO calendar VALUES ('2019-05-04', '9177043031');
	INSERT INTO calendar VALUES ('2019-05-03', '9177043031');
	INSERT INTO calendar VALUES ('2019-05-03', '4154444444');
	INSERT INTO calendar VALUES ('2019-06-03', '4154444444');

	read:
	SELECT * FROM calendar;
	SELECT * FROM calendar INNER JOIN users ON (users.uid = calendar.uid_off) WHERE Date = '2019-05-03';
	SELECT * FROM calendar
		INNER JOIN users ON (users.uid = calendar.uid_off) 
		WHERE Date BETWEEN '2019-05-01' AND date '2019-05-01' + INTERVAL '1 month';

	SELECT * FROM calendar 
		INNER JOIN users ON (users.uid = calendar.uid_off)
		WHERE Date = '2019-05-03' AND users.uid = 9177043031;

	remove:
	DELETE FROM calendar WHERE date = '2019-05-03' AND uid_off = '1';
	DANGER DELETE FROM calendar WHERE uid_off = '7777777777';


	heroku pg:psql       \q


	ALTER TABLE calendar ADD COLUMN status text;
	ALTER TABLE calendar ADD COLUMN notified int;




	select status,count(*) from calendar group by status;