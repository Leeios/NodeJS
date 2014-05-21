/*
** /lang_fr
** /lang_en
*/

var server = require('../server');

exports.lang_fr = function(req,res)
{
	var i18n = server.i18n;
	i18n.setLng('fr', function(t) {
		res.redirect('/');
	});
}
exports.lang_en = function(req,res)
{
	var i18n = server.i18n;
	i18n.setLng('en', function(t) {
		res.redirect('/');
	});
}
