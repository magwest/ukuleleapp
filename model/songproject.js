var db = require('mongoose');

var ProjectSchema = new db.Schema({
  artist : String,
  title: String,
  user_lib_id: String,
  user_lib_name: String,
  song: [{}],
  description: String,
  shared: {type: Boolean, default: false},
  saved_from_other : {type: Boolean, default: false},
  old_id : String,
  date : {type: Date, default: Date.now}

});

ProjectSchema.methods.share = function() {
  this.shared = true;
  this.save();
};


db.model('SongProject', ProjectSchema);
