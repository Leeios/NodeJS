/*
** /admin
** /admin_change
*/
var User = require('mongoose').model('User'),
	user_method = require('../model/user');

exports.admin_change = function(req, res)
{
	User.find({}, {login: 1, password: 1, group: 1}, function(err, doc){
		if (err) console.log("Error changing data:" + err);
		else
		{
			if (req.body.new_user != undefined && req.body.new_user.create == 'Create')
			{
				add_user(req.body.new_user.login, req.body.new_user.passwd, req.body.new_user.group, req, res, '/admin');
				return ;
			}
			doc.forEach(function(value){
				if (req.body[value.login] != undefined)
				{
					if (req.body[value.login].new_login != undefined)
						modify_user(value, req.body[value.login].new_login, 0);
					else if (req.body[value.login].new_passwd != undefined)
						modify_user(value, req.body[value.login].new_passwd, 1);
					else if (req.body[value.login].new_group != undefined)
						modify_user(value, req.body[value.login].new_group, 2);
					else if (req.body[value.login] == 'Delete')
						modify_user(value, undefined, 3);
					res.redirect('/admin');
				}
			});
		}
	});
}

exports.admin = function(req, res)
{
	if (req.Identity.group == 'admin')
		user_method.userlist('admin', req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}

