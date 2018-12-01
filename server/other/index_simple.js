const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var pg = require('pg');
var app = express();



app.get('/', function (req, res) {
	  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('SELECT * FROM mvp', function(err, result) {
	      done();
	      if (err)
	       { console.error(err); res.send("Error " + err); }
	      else
	       { res.json( result.rows ); }
	    });
	  });
	})


// CREATE
app.post('/createuser/:phoneNo/:fullName', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('INSERT INTO mvp VALUES ($1, $2, $3)', [ req.params.phoneNo, req.params.fullName, []])
	   	done();
	   	res.send( req.params.fullName + ' successfully added' )
	})
})

// READ 
app.get('/:phoneNo/get/', function (req, res) {
	  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('SELECT * FROM mvp WHERE phone = '+req.params.phoneNo, function(err, queryResult) {
	      done();
	      if (err)
	       { console.error(err); res.send("Error " + err); }
	      else
	       { res.send( queryResult.rows ); }
	    });
	  });
	})


// UPDATE 
app.post('/:phoneNo/add/:date', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('UPDATE mvp SET dates = array_append(dates, $1) WHERE phone = '+req.params.phoneNo, [ req.params.date+':[]' ] ) 
	   	done();
	   	res.send( req.params.date + ' successfully added' )
	})
})

// DELETE 
app.post('/:phoneNo/delete/:date', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('UPDATE mvp SET dates = array_remove(dates, $1) WHERE phone = '+req.params.phoneNo, [ req.params.date+':[]' ] ) 
	   	done();
	   	res.send( req.params.date + ' deleted' )
	})
})


// ADMIN: https://healthserve.herokuapp.com/users
// app.get('/users', function (req, res) {
// 	  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
// 	    client.query('SELECT * FROM users', function(err, result) {
// 	      done();
// 	      if (err)
// 	       { console.error(err); res.send("Error " + err); }
// 	      else
// 	       { res.json( result.rows ); }
// 	    });
// 	  });
// 	})

// ADMIN: https://healthserve.herokuapp.com/calendar
// app.get('/calendar', function (req, res) {
// 	  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
// 	    client.query('SELECT * FROM calendar', function(err, result) {
// 	      done();
// 	      if (err)
// 	       { console.error(err); res.send("Error " + err); }
// 	      else
// 	       { res.json( result.rows ); }
// 	    });
// 	  });
// 	})



app.listen(PORT, () => console.log(`Listening on ${ PORT }`))