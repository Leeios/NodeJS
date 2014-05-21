/*
** /ticket
** /ticket_post
*/
var post_method = require('../model/post');

exports.ticket = function(req, res)
{
	if (req.Identity.user != undefined)
		res.render('index.ejs', {'page': 'ticket', 'logged': req.Identity.user
				, 'group': req.Identity.group});
	else
		res.send(401, 'You\'re not allowed to see this page');
}
exports.ticket_post = function(req, res)
{
	if (req.Identity.user != undefined)
		post_method.postTicket(req, res);
	else
		res.send(401, 'You\'re not allowed to see this page');
}
