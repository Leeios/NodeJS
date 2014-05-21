var http = require('http'),
	https = require('https'),
	fs = require('fs'),
	express = require('express'),
	favicon = require('static-favicon'),
	bodyParser = require('body-parser'),
	sessions = require('client-sessions'),
	ejs = require('ejs'),
	mongoose = require('mongoose');

var httpProxy = require('http-proxy');

var app = express();
var routes = require('./routes');

//Server on
var server = http.createServer(app).listen(3000, function(){
	console.log("Express server listening on port " + 3000);
});

var io = require('socket.io').listen(server);
var i18n = require('i18next');
i18n.init({
	load: 'current',
	saveMissing: true,
	cookieName: 'lang',
	resGetPath: 'locales/__lng__.json',
	detectLngFromPath: 0,
	detectLngFromHeaders: false,
	supportedLngs: ['en', 'fr'],
	fallbackLng: 'en'
});

//Config
app.use('/public', express.static('public'));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(bodyParser());
app.use(sessions({
	cookieName: 'Identity',
	secret: 'Jamdude599*=/Hih98&*@32454d0',
	duration: 24 * 60 * 60 * 1000
}));
i18n.registerAppHelper(app);
app.use(i18n.handle);

module.exports.app = app;
module.exports.i18n = i18n;

ejs.filters.t = function(key) {
	return i18n.t(key);
};


//Get link
app.get('/', routes.index);
//LANG
app.get('/fr', routes.lang_fr);
app.get('/en', routes.lang_en);
//Menu
app.get('/game', routes.game);
app.get('/subscribe', routes.subscribe);
app.get('/pwdchange', routes.pwdchange);
app.get('/login', routes.login);
app.get('/delog', routes.delog);
app.get('/index', routes.index);
app.get('/list', routes.list);
app.get('/ldap', routes.ldap);
app.get('/ticket', routes.ticket);

//Forum edit
app.get('/forum/:path/:path/:path/edit', routes.edit);
app.get('/forum/:path/:path/edit', routes.edit);
app.get('/forum/:path/edit', routes.edit);
app.get('/forum/edit', routes.edit);
//Forum delete
app.get('/forum/:path/:path/:path/delete', routes.delete);
app.get('/forum/:path/:path/delete', routes.delete);
app.get('/forum/:path/delete', routes.delete);
app.get('/forum/delete', routes.delete);
//Forum new topic
app.get('/forum/:path/:path/new_topic', routes.new_topic);
app.get('/forum/:path/new_topic', routes.new_topic);
app.get('/forum/new_topic', routes.new_topic);
//else
app.get('/forum/:path/:path/:path', routes.forum_final);
app.get('/forum/:path/:path', routes.forum);
app.get('/forum/:path', routes.forum);
app.get('/forum', routes.forum_index);
app.get('/admin', routes.admin);

//IO socket
io.set('authorization', routes.auth_socket);
io.sockets.on('connection', routes.s_connect);


//Post link
app.post('/subscribe', routes.create);
app.post('/login', routes.logging);
app.post('/pwdchange', routes.change_pwd);
app.post('/ticket', routes.ticket_post);
//Forum edit post
app.post('/forum/:path/:path/:path/edit', routes.edit_post);
app.post('/forum/:path/:path/edit', routes.edit_post);
app.post('/forum/:path/edit', routes.edit_post);
app.post('/forum/edit', routes.edit_post);

app.post('/forum/:path/:path/new_topic', routes.post_new_topic);
app.post('/forum/:path/:path/:path', routes.display_reply);
app.post('/forum/:path/new_topic', routes.post_new_topic);
app.post('/forum/new_topic', routes.post_new_topic);
app.post('/admin', routes.admin_change);

//Error
app.use(routes.default);


// httpProxy.createServer({
// 	target: {
// 		host: 'localhost',
// 		port: 9009
// 	},
// 	ssl: {
// 		key: fs.readFileSync(__dirname + '/data/ssl/key.pem', 'utf8'),
// 		cert: fs.readFileSync(__dirname + '/data/ssl/csr.pem', 'utf8')
// 	}
// }).listen(8009);
