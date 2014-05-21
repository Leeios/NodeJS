/*
** /create
** /change_pwd
** /subscribe
** /pwdchange
** /list
*/
var User = require('mongoose').model('User'),
	user_method = require('../model/user'),
	bcrypt = require('bcrypt');

function	add_user(login, password, group, req, res, redir)
{
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(password, salt, function(err, hash){
			if (err) console.log("Error encoding passwd");
			else
			{
				var user_to_insert = new User
				({
					login: login,
					password: hash,
					group: group,
					id_p: 0
				});
				user_to_insert.save(
					function (err)
					{
						if (err) console.error(err);
						else console.log('Subscribe: DONE');
					});
				req.Identity.user = login;
				res.redirect(redir);
			}
		});
	});
}
function	modify_user(doc, new_data, type_data)
{
	if (type_data == 0)
		doc.login = new_data;
	else if (type_data == 2)
		doc.group = new_data;
	else if (type_data == 3)
	{
		doc.remove(function(err, product){
			if (err) console.log('Error while deleting user '+ err);
			else console.log('Delete user: DONE');
		});
	}
	else if (type_data == 1)
	{
		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(new_data, salt, function(err, hash){
				if (err) console.log("Error encoding passwd");
				else
				{
					doc.password = hash;
					doc.save(function (err) {
						if (err) console.error(err);
						else console.log('HashPwd Change: DONE');
					});
				}
			});
		});
	}
	doc.save(function (err) {
			if (err) console.error(err);
			else console.log('Change: DONE');
		});
}

//POST EXPORTS

exports.create = function(req, res)
{
	User.findOne({login: req.body.user.login}, function(err, doc){
	{
		if (err)
			console.log("Error while checking login" + err);
		else if (doc == null)
			add_user(req.body.user.login, req.body.user.passwd, 'member', req, res, '/list');
		else
			res.render('index.ejs', {'page': 'subscribe'
				, 'logged': req.Identity.user, 'misc': 'exist'});
	}});
}

exports.change_pwd = function(req,res)
{
	User.findOne({login: req.Identity.user}, {login: 1, password: 1}
		, function(err, doc){
		if (err) console.log("Error while searching login:" + err);
		else if (doc == null) console.log("Can't find identity");
		else
		{
			bcrypt.compare(req.body.user.old_pwd, doc.password, function(err, result){
				if (err)
					console.log("Error while checking password: " + err);
				else if (result)
				{
					bcrypt.genSalt(10, function(err, salt){
						bcrypt.hash(req.body.user.new_pwd, salt, function(err, hash){
							if (err) console.log("Error encoding passwd");
							else
							{
								console.log('Password changed');
								doc.password = hash;
								doc.save(function (err)
								{
									if (err) console.error(err);
									else console.log('Change password: DONE');
								});
								res.redirect('/');
							}
						});
					});
				}
				else
					res.render('index.ejs', {'page': 'pwdchange'
						, 'logged': req.Identity.user, 'misc': 'exist_pwd'});
			});
		}
	});
}


//GET EXPORTS

exports.subscribe = function(req, res)
{
	res.render('index.ejs', {'page': 'subscribe', 'logged': req.Identity.user
			, 'group': req.Identity.group});
}

exports.pwdchange = function(req, res)
{
	if (req.Identity.user != undefined)
		res.render('index.ejs', {'page': 'pwdchange', 'logged': req.Identity.user
				, 'group': req.Identity.group});
	else
		res.send(401, 'You\'re not allowed to see this page');
}
exports.list = function(req, res)
{
	if (req.Identity.user != undefined &&
		(req.Identity.group == 'ldap' || req.Identity.group == 'admin'))
		user_method.userlist('list', req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}
