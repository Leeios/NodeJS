/*
** /forum_index
** /forum
** /forum_final
** /new_topic
*/
var post_method = require('../model/post');

exports.forum_index = function(req, res)
{
	if (req.Identity.user != undefined)
		post_method.postlist(req, res, ['', 'forum']);
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.forum = function(req, res)
{
	var path = req.originalUrl.split('/');
	if (req.Identity.user != undefined)
		post_method.postlist(req, res, path);
	else
		res.send(401, 'You\'re not allowed to see this page');
}
exports.forum_final = function(req, res)
{
	var path = req.originalUrl.split('/');
	title = path[path.length - 1];
	path.length -= 1;
	if (req.Identity.user != undefined)
		post_method.postcontent(req, res, path, title);
	else
		res.send(401, 'You\'re not allowed to see this page');
}
exports.new_topic = function(req, res)
{
	var path = req.originalUrl.replace('/new_topic', '');
	var tab_path = path.split('/');
	if ((tab_path.length == 4 && req.Identity.group == 'member')
		|| (tab_path.length > 2 && req.Identity.group == 'moderator')
		|| (req.Identity.group == 'admin'))
		res.render('index.ejs', {'page': 'new_topic', 'logged': req.Identity.user
				, 'group': req.Identity.group, 'path': path});
	else
		res.send(401, 'You\'re not allowed to post here');
}
