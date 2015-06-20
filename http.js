var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');
var db = require('mongoose');
var publicFiles = path.join(__dirname, 'public');


//DB connection
require('./model/songproject');
require('./model/user');
db.connect('mongodb://localhost/ukulele');
var Song = db.model('SongProject');
var UserData = db.model('UserLastData');

//Creating the server app
var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicFiles));



/*-----------------------------------------*/
//request handlers

app.get('/', function(req, res, next){
	res.sendFile(publicFiles + '/index.html');
});



//A server side request to the api
app.get('/apireq', function(req,res,next){
	var q = req.query;
	request('http://www.ukulele-chords.com/get?ak=' + q.ak + '&r=' + q.r + '&typ=' + q.typ,
		function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	res.set('Content-Type', 'text/xml');
		    res.send(body);
		  }
	});
});




//save song to db
app.post('/save', function(req,res,next) {
	var s = new Song(req.body);
	s.save(function(err,song) {
		if(err) next(err);
		res.json(song);
	});
});


//get a song
app.post('/song', function(req,res,next) {
	Song.find(req.body, function(err, data) {
		if(err) next(err);
		res.json(data);
	})
});
//send user library
app.post('/mylibrary', function(req,res,next) {
	Song.find(req.body).sort({date: 'descending'}).exec(function(err,data) {
		res.json(data);
	});
});
//send shared songs
app.post('/shared',function(req,res,nex) {
	Song.find({'shared':true}).sort({date: 'descending'}).exec(function(err,data) {
		res.json(data);
	});
});
//delete song
app.post('/delete',function(req,res,next) {
	Song.findById(req.body.id).remove(function(err){
		if(err) next(err);
		res.sendStatus(200);
	});
});
//update song
app.post('/update',function(req,res,next) {
	var song = req.body;
	Song.findById(song._id).update(song,function(err) {
		if(err) next(err);
		res.sendStatus(200);
	})
});

//set a song to shared
app.post('/share', function(req,res,next) {
	Song.findById(req.body.id, function(err,song) {
		song.share();
		res.sendStatus(200);
	});
});
//search
app.post('/search', function(req,res,next) {
	var sw = new RegExp(req.body.sw, 'i');
	Song.find({shared:true}).or([{artist:sw},{title:sw},{user_lib_name:sw}]).sort({date: 'descending'}).exec(function(err,result){
		res.json(result);
	})
});

//get users last editing project
app.post('/persist', function(req,res,next){
	var id = req.body.uid;
	var project = req.body.project;
	console.log(id);
	console.log(project);
	UserData.update({user_id:id},{project:project},{upsert:true}).exec(function(err,result) {
		if(err) next(err);
		console.log(result);
		res.sendStatus(200);
	});
});

//get users last edited project
app.post('/userp',function(req,res,next) {
	UserData.find({user_id:req.body.uid},function(err,result) {
		if(err) next(err);
		console.log(result)
		if(result.length==0){
			console.log('its null')
			res.send(null);
		} else{
			console.log('found it!')
			res.json(result[0].project);
		}
	})
});


/*-----------------------------------------*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  	var err = new Error('Not Found');
  	err.status = 404;
  	next(err);
});

// error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  	res.status(err.status || 500);
  	res.send(err.status + " " + err.message);
});




//Running up the server
var port = 8000;
app.listen(port, function(){
	console.log('Server running on %s', port);
})
