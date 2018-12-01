const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var pg = require('pg');
var app = express();

var dateFormat = require('dateformat');
var FCM = require('fcm-node');
var serverKey = process.env.FIREBASE_KEY; //put your server key here
var fcm = new FCM(serverKey);
 
    

// AUTH ROUTE: GET PHONE NUMBER, CHECK IF EXISTS, AND ROUTE
app.post('/2/auth/:phoneNo/', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('SELECT * FROM users WHERE phone = '+req.params.phoneNo, function(err, queryResult) {
	    done();
	    // 1A CREATE NEW ACCOUNT IF THERE IS NO ACCOUNT UNDER THIS NUMBER AND RESPOND
 	    if (queryResult.rowCount === 0){ 
 	    	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    	client.query('INSERT INTO users VALUES ($1, $2)', [ req.params.phoneNo, req.params.phoneNo]) 
	    	done();
			})
	  			res.send( req.params.phoneNo + ' created' )
		}
		// 1B IF THE ACCOUNT EXISTS ALREADY DO NOTHING AND RESPOND
	    else{
			 	res.send( req.params.phoneNo + ' exists' )
	    }
	    });
	})	
})

// LOGIN: CONFIRM PIN FOR EXISTING ACCOUNTS @ POST https://healthserve.herokuapp.com/login/9177043031/8523
app.post('/2/login/:phoneNo/:PIN/', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('SELECT pin, usergroup FROM users WHERE phone = '+req.params.phoneNo, function(err, queryResult) { done();

		if 	(req.params.PIN === queryResult.rows[0]['pin'].toString()){ res.send(queryResult.rows[0]['usergroup'].toString())}
		else{ res.send('false') }
		})
	})
})

// REGISTER: CREATE PIN AND REGISTER NAME FOR NEW ACCOUNTS @ POST https://healthserve.herokuapp.com/register/4154444444/8523/Sarah Mango
app.post('/2/register/:phoneNo/:PIN/:name/:usergroup', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query(`UPDATE users SET (uid, phone, name, PIN, usergroup, firstrun ) = (`+
	    				req.params.phoneNo +` , ` +
	    				req.params.phoneNo +` , '` +
	    				req.params.name +`' , ` +
	    				req.params.PIN +` , '` +
	    				req.params.usergroup + `',
	    				'true' ) WHERE uid = `+req.params.phoneNo + `;`, function(err, queryResult) { done();
		res.send(queryResult)
		})
	})
})

// CALENDAR: SEND MONTH OF TIME OFF @ GET https://healthserve.herokuapp.com/getdates/9177043031/2019-05-01
app.get('/2/getdates/:usergroup/:date', function (req, res) {
	  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query(`SELECT date, phone, name, usergroup, status FROM calendar
	    				 INNER JOIN users ON (users.uid = calendar.uid_off) 
	    				 WHERE Date BETWEEN '`+req.params.date+
	    				 `' AND date '` + req.params.date + `' + INTERVAL '1 month' - INTERVAL '1 day'
	    				 AND LOWER(usergroup) = LOWER('` + req.params.usergroup + `');`, function(err, queryResult) { done();
		   	var gaggi = {}
	        gaggi.dates = {}
	        for (var i = 1; i < 32; i++){
	        	var dateString = req.params.date
	        	dateString = dateString.substring(0, dateString.length - 2)
	            if (i < 10){ dateString = dateString + "0" + i }
	            else{ dateString = dateString + i }
	           	gaggi.dates[dateString] = []
	        }
	        for (var row in queryResult.rows){
	            var myDate = new Date(queryResult.rows[row].date)
	            var dd = myDate.getDate();
	            var mm = myDate.getMonth()+1; //January is 0!
	            var yyyy = myDate.getFullYear();
	            if(dd<10) { dd = '0'+dd }; if(mm<10) { mm = '0'+mm } 
	            myDate = yyyy + '-' + mm + '-' + dd;
	            gaggi.dates[myDate].push({'name': queryResult.rows[row].name, 'phone': queryResult.rows[row].phone, 'status': queryResult.rows[row].status })
	        }
	      if (err)
	       { console.error(err); res.send("Error " + err); }
	      else
	       { res.send( gaggi ); }
	    });
	  });
	})


// TOGGLE DATES: TOGGLE SPECIFIC DATE ON AND OFF @ POST https://healthserve.herokuapp.com/toggledate/9177043031/2019-05-01
app.post('/2/toggledate/:phoneNo/:date', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query(`SELECT * FROM calendar 
	    				INNER JOIN users ON (users.uid = calendar.uid_off) 
	    				WHERE Date = '`+req.params.date+`' AND users.uid = `+req.params.phoneNo+`;`
	    				, function(err, queryResult) { 
	    	done();
	 	    if (queryResult.rowCount === 0){
	 	    	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    		client.query('INSERT INTO calendar VALUES ($1, $2)', [ req.params.date, req.params.phoneNo ])
		   			done();
				})
		  		 res.send( 'added' )
			}
		    else{
		    	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    		client.query("DELETE FROM calendar WHERE date = '"+ req.params.date +"' AND uid_off = " +req.params.phoneNo +";")
		   			done();
				})
				 res.send( 'deleted' )
		    }
	});
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query(`	WITH x AS (
	    					SELECT usergroup FROM users WHERE uid = `+req.params.phoneNo+`
	    					)
						SELECT 
							users.token
						FROM 
							x, calendar 
						INNER JOIN 
							users 
						ON 
							(users.uid = calendar.uid_off) 
						WHERE
							Date = '`+req.params.date+`' 
						AND 
							LOWER(users.usergroup) = LOWER(x.usergroup);`, function(err, queryResult){
								
	    					for (var row in queryResult.rows){
	    						if (queryResult.rows[row].token){
	    							// console.log('token exists: '+queryResult.rows[row].token)
	    					    	notifyUsersOfMatch(queryResult.rows[row].token, req.params.date)
	    					    }
	    					}
	    					
	    					// hardcode my ipad test:
	    					// notifyUsersOfMatch('eyw7iXpJGD8:APA91bH_t8kFyqoLWZGDpBpcV_BN7HgHLXADSpXBulVCuU4U7SNfQA8syl99Yh24AZwfI29IXc3qnlNcLxD1TfPVjGH5pbABJ7vzpaOXH2DP0Hwai_fFTd4MqY-wCihkxD4520YFMuRKKV4BbAMFr4DYt_N4bsbnxw')
	    				})
		})
})


function notifyUsersOfMatch(token, date){
		// create message
		humanDate = dateFormat(date, "dddd, mmmm dS");
		var message = { 
		    to: token, 
		    notification: {
		        title: 'Someone just marked themselves off!', 
		        body: 'On '+humanDate+' (when you are also off)' 
		    }
		};
		// send message
		fcm.send(message, function(err, response){
		    if (err) {
		    	console.log(err)
		        console.log("Something has gone wrong!");
		    } else {
		        console.log("Successfully sent with response: ", response);
		    }
		});
}



// ADD STATUS AND TOGGLE DATE IF NOT SET ALREADY
app.post('/2/addstatus/:phoneNo/:date/:status', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query(`SELECT * FROM calendar 
	    				INNER JOIN users ON (users.uid = calendar.uid_off) 
	    				WHERE Date = '`+req.params.date+`' AND users.uid = `+req.params.phoneNo+`;`
	    				, function(err, queryResult) { done();
		    
	 	    if (queryResult.rowCount === 0){ 
	 	    	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    		client.query('INSERT INTO calendar VALUES ($1, $2, $3)', [ req.params.date, req.params.phoneNo, req.params.status ])
		   			done();
				})
		  		 res.send( 'created + status added' )
			}
		    else{
		    	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    		client.query("UPDATE calendar SET status = '"+req.params.status+"' WHERE date = '"+ req.params.date +"' AND uid_off = " +req.params.phoneNo +";")
		   			done();
				})
				 res.send( 'status added' )
		    }
	    });
	})
	})
})





// GET FIRSTRUN: GET @ https://healthserve.herokuapp.com/2/firstrun/9177043031/
app.get('/2/firstrun/:phoneNo/', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('SELECT firstrun FROM users WHERE phone = '+req.params.phoneNo, function(err, queryResult) { done();
		res.send(queryResult.rows[0]['firstrun'])
		})
	})
})


// UNDO FIRSTRUN: POST @ https://healthserve.herokuapp.com/2/firstrun/9177043031/toggle
app.post('/2/firstrun/:phoneNo/toggle', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query(`UPDATE users SET firstrun = 'false' WHERE phone = `+req.params.phoneNo, function(err, queryResult) { 
	    	res.send('worked')
	    	done();
		})
	})
})


// CHANGE USERGROUP: POST @ https://healthserve.herokuapp.com/2/alterusergroup/9177043031/stanim2019
app.post('/2/alterusergroup/:phoneNo/:usergroup', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query(`UPDATE users SET usergroup = '`+req.params.usergroup+`' WHERE phone = `+req.params.phoneNo, function(err, queryResult) { 
	    	res.send('worked')
	    	done();
		})
	})
})



	


// SAVE TOKEN: POST @ https://healthserve.herokuapp.com/2/puttoken/9177043031/xxxxxxxxxxxxxxxxxxxxxx
app.post('/2/puttoken/:phoneNo/:token', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query(`UPDATE users SET token = '`+req.params.token+`' WHERE phone = `+req.params.phoneNo, function(err, queryResult) { 
	    	res.send('worked')
	    	done();
		})
	})
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))