var	mongoose = require('mongoose'),
	user_method = require('../model/user'),
	post_method = require('../model/post'),
	model = require('../model/db'),
	bcrypt = require('bcrypt');

var User = require('mongoose').model('User');
var Player = require('mongoose').model('Player');
var Post = require('mongoose').model('Post');


/*-------------IMPORT EXPORT-------------*/

//ADMIN
exports.admin = require('./ft_admin.js').admin;
exports.admin_change = require('./ft_admin.js').admin_change;

//FORUM
exports.forum_index = require('./ft_forum.js').forum_index;
exports.forum = require('./ft_forum.js').forum;
exports.forum_final = require('./ft_forum.js').forum_final;
exports.new_topic = require('./ft_forum.js').new_topic;

//FORUM_CRUD
exports.post_new_topic = require('./ft_forum_crud.js').post_new_topic;
exports.edit = require('./ft_forum_crud.js').edit;
exports.edit_post = require('./ft_forum_crud.js').edit_post;
exports.delete = require('./ft_forum_crud.js').delete;
exports.display_reply = require('./ft_forum_crud.js').display_reply;

//I18N
exports.lang_fr = require('./ft_i18n.js').lang_fr;
exports.lang_en = require('./ft_i18n.js').lang_en;

//LOG
exports.ldap = require('./ft_log.js').ldap;
exports.login = require('./ft_log.js').login;
exports.logging = require('./ft_log.js').logging;
exports.delog = require('./ft_log.js').delog;

//SOCKET
exports.game = require('./ft_socket.js').game;
exports.auth_socket = require('./ft_socket.js').auth_socket;
exports.s_connect = require('./ft_socket.js').s_connect;

//TICKET
exports.ticket = require('./ft_ticket.js').ticket;
exports.ticket_post = require('./ft_ticket.js').ticket_post;

//USER
exports.create = require('./ft_user.js').create;
exports.change_pwd = require('./ft_user.js').change_pwd;
exports.subscribe = require('./ft_user.js').subscribe;
exports.pwdchange = require('./ft_user.js').pwdchange;
exports.list = require('./ft_user.js').list;


exports.index = function(req, res)
{
	res.render('index.ejs', {'page': 'home', 'logged': req.Identity.user
			, 'group': req.Identity.group});
}

exports.default = function(req, res, next)
{
	res.setHeader('Content-Type', 'text/plain');
	res.send(404, '404 NOT FOUND');
}
