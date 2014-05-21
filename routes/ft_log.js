/*
** /ldap
** /login
** /delog
*/

var bcrypt = require('bcrypt');
var LDAP = require('LDAP');
var User = require('mongoose').model('User');
var ldap;

//LDAP
function	dynamicSort(property) {
	var sortOrder = 1;
	if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}
function	parseDateLDAP(ldap_date)
{
	ldap_date.length -= 7;
	return (ldap_date);
}
function	connect_ldap(req, res, uid, pwd)
{
	ldap = new LDAP({
		uri: 'ldaps://ldap.42.fr:636/',
		version: 3,
		starttls: false,
		connecttimeout: 1,
		reconnect: true
	});
	var bind_options = {
		binddn: 'uid='+uid+',ou=2013,ou=people,dc=42,dc=fr',
		password: pwd
	};
	ldap.open(function(err) {
		if (err) console.log('Cannot connect LDAP :' + err);
		else
		{
			console.log('LDAP Connection: DONE');
			ldap.simplebind(bind_options, function(err) {
				if (err)
				{
					console.log('Can\'t bind to LDAP: ' + err);
					res.render('index.ejs', {'page': 'login'
						, 'logged': req.Identity.user, 'misc': 'exist_pwd'});
				}
				else
				{
					console.log('Bind to LDAP');
					if (req.Identity.group != 'admin')
					{
						req.Identity.user = uid;
						req.Identity.group = 'ldap';
					}
					res.redirect('/ldap');
				}
			});
		}
	});
}
function	display_ldap(req, res)
{
	if (req.Identity.group != 'ldap' && req.Identity.group != 'admin')
		res.send(401, 'You\'re not allowed to see this page');
	else
	{
		var search_options = {
			base: 'ou=people,dc=42,dc=fr',
			scope: 3,
			filter: '',
			attrs: ''
		};
		ldap.search(search_options, function(err, data){
			if (err) console.log ('Error getting LDAP: ' + err);
			else
			{
				data.sort(dynamicSort('uid'));
				var btoa = require('btoa');
				data.forEach(function(elem)
				{
					//Parse birth date
					if (elem['birth-date'] != undefined)
						elem['birth-date'][0] = elem['birth-date'][0].substring(0, 4)
							+ '/' + elem['birth-date'][0].substring(4, 6) + '/'
							+ elem['birth-date'][0].substring(6, 8);
				});
				res.render('index.ejs', {'page': 'ldap_book'
					, 'logged': req.Identity.user, 'group': req.Identity.group,
					'user_list': data});
			}
		});
	}
}

//MAIN LOG
exports.logging = function(req, res)
{
	User.findOne({login: req.body.user.login}, {login: 1, password: 1, group: 1}
		, function(err, doc){
		if (err)
			console.log("Error while checking login" + err);
		else if (doc == null)
			connect_ldap(req, res, req.body.user.login, req.body.user.passwd);
		else
		{
			bcrypt.compare(req.body.user.passwd, doc.password, function(err, result){
				if (err)
					console.log("Error while checking password: " + err);
				else if (result)
				{
					req.Identity.user = doc.login;
					req.Identity.group = doc.group;
					if (doc.group == 'admin')
						connect_ldap(req, res, 'hdezier', 'ur2RHY2W');
					else
						res.redirect('/forum');
				}
				else
					connect_ldap(req, res, req.body.user.login, req.body.user.passwd);
			});
		}
	});
}

//GET
exports.ldap = function(req, res)
{
	if (req.Identity.user != undefined)
		display_ldap(req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}
exports.login = function(req, res)
{
	res.render('index.ejs', {'page': 'login', 'logged': req.Identity.user
			, 'group': req.Identity.group});
}
exports.delog = function(req, res)
{
	req.Identity.reset();
	ldap = new LDAP({
		uri: 'ldaps://ldap.42.fr:636/',
		version: 3,
		starttls: false,
		connecttimeout: 1,
		reconnect: true
	});
	res.redirect('/');
}
