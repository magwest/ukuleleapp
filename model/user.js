//a model for storing the users last edited project to add some persistance

var db = require('mongoose');

var UserSchema = new db.Schema({
  user_id : String,
  project : {}
});


db.model('UserLastData', UserSchema);
