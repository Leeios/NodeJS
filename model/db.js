var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	login: String,
	password: {type: String, select: false},
	group: String,
	id_p: 0
});
var postSchema = new mongoose.Schema({
	title: String,
	content: String,
	path: Array,
	author: String,
	date: Date,
	id_p : 0
});
var playerSchema = new mongoose.Schema({
	name: String,
	x: { type: Number, min: 0},
	y: { type: Number, min: 0},
	hp: { type: Number, min: 0},
	mp: { type: Number, min: 0},
	type: String,
	id_p: 0
});
mongoose.model('User', userSchema);
mongoose.model('Player', playerSchema);
mongoose.model('Post', postSchema);
mongoose.connect('mongodb://localhost/user');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback ()
{
	console.log('Connection to database: DONE');
});
