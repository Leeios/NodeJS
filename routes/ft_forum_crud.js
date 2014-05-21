/*
** /post_new_topic
** /edit
** /edit_post
** /delete
** /display_reply
*/
var post_method = require('../model/post');
var Post = require('mongoose').model('Post');



//POST
//Securiser if title = new_topic || title = none
exports.post_new_topic = function(req, res)
{
	var path = req.originalUrl.replace('/new_topic', '');
	var tab_path = path.split('/');
	if ((tab_path.length == 4 && req.Identity.group == 'member')
		|| (tab_path.length > 2 && req.Identity.group == 'moderator')
		|| (req.Identity.group == 'admin'))
	{
		var post_to_insert = new Post
		({
			title: encodeURIComponent(req.body.post.title),
			content: req.body.post.content,
			path: tab_path,
			author: req.Identity.user,
			date: new Date(),
			id_p: 0
		});
		post_to_insert.save(
			function (err)
			{
				if (err) console.error(err);
				else console.log('Post: DONE');
			});
		res.redirect(path);
	}
	else
		res.send(401, 'You\'re not allowed to post here');
}
exports.edit_post = function(req, res)
{
	var path = req.originalUrl;
	tab_path = path.split('/');
	title = tab_path[tab_path.length - 2];
	tab_path.length -= 2;
	if ((req.Identity.group == 'admin')
		|| (req.Identity.group == 'moderator' && tab_path.length > 2))
		post_method.edit_db(req, res, tab_path, title);
	else
		res.send(401, 'You\'re not allowed to see this page');
}
//GET
exports.edit = function(req, res)
{
	var path = req.originalUrl;
	tab_path = path.split('/');
	title = tab_path[tab_path.length - 2];
	tab_path.length -= 2;
	if ((req.Identity.group == 'admin')
		|| (req.Identity.group == 'moderator' && tab_path.length > 2))
		post_method.get(req, res, tab_path, title);
	else
		res.send(401, 'You\'re not allowed to see this page');
}
exports.delete = function(req, res)
{
	var path = req.originalUrl;
	tab_path = path.split('/');
	title = tab_path[tab_path.length - 2];
	tab_path.length -= 2;
	if (req.Identity.group == 'member'
		|| (req.Identity.group == 'moderator'
			&& tab_path.length < 3))
		res.send(401, 'You\'re not allowed to see this page');
	else
		post_method.deleteOne(req, res, tab_path, title);
}
exports.display_reply = function(req, res)
{
	var path = req.originalUrl;
	if (req.body.text_reply != undefined)
	{
		var post_to_insert = new Post
		({
			title: 'NONE',
			content: req.body.text_reply,
			path: path.split('/'),
			author: req.Identity.user,
			date: new Date(),
			id_p: 0
		});
		console.log(post_to_insert);
		post_to_insert.save(
			function (err)
			{
				if (err) console.error(err);
				else console.log('Reply: DONE');
			});
	}
	res.redirect(path);
}
