var mongoose = require('mongoose');

exports.postlist = function(req, res, path)
{
	var Post = mongoose.model('Post');
	Post.find({'path': path})
	.sort({date: 1})
	.exec(function (err, posts){
	if(err)
		console.log("Get post list:" + err);
	else
	{
			var sub_posts = new Array;
			var pending = 0;
			if (posts[0] == undefined)
				res.render('index.ejs', {'page': 'forum'
					, 'post_list': posts, 'sub_post': undefined
					, 'logged': req.Identity.user, 'group': req.Identity.group
					, 'path' : path});
			for (var i = 0; posts[i] != undefined; i++)
			{
				var tmp_path = posts[i].path.slice(0);
				tmp_path.push(posts[i].title);
				posts[i].title = decodeURIComponent(posts[i].title);
				Post.find({'path': tmp_path})
				.sort({title: 1})
				.exec(function(err, bis_posts) {
					if (err) console.log('Error loading subforum');
					else
						sub_posts.push(bis_posts);
					pending -= 1;
					if (!pending)
					{
						sub_posts.forEach(function(element){
							element.forEach(function(elem){
								elem.title = decodeURIComponent(elem.title);
							});
						});
						res.render('index.ejs', {'page': 'forum'
							, 'post_list': posts, 'sub_post': sub_posts
							, 'logged': req.Identity.user, 'group': req.Identity.group
							, 'path' : path});
					}
				});
				pending += 1;
			}
	}
})}

exports.postcontent = function(req, res, path, title){
	var Post = mongoose.model('Post');
	var full_path = path.slice(0);
	full_path.push(title);
	Post.find({$or: [{'path': full_path}, {'path': path, 'title': title}]})
		.sort({date: 1}).exec(
		function (err, posts) {
		if(err) console.log("Get post list:" + err);
		else
		{
			for (var i = 0; posts[i]; i++)
				posts[i].title = decodeURIComponent(posts[i].title);
			res.render('index.ejs', {'page': 'forum_final', 'post_list': posts
				, 'logged': req.Identity.user, 'group': req.Identity.group
				, 'path' : path});
		}
})}

exports.get = function(req, res, path, title)
{
	var Post = mongoose.model('Post');
	Post.findOne({'path': path, 'title': title}, function(err, post)
	{
		if (err) console.log('Error getting data for edit');
		else
			res.render('index.ejs', {'page': 'edit', 'logged': req.Identity.user
					, 'group': req.Identity.group, 'post_list': post
					, 'path': path});
	});
}

function	editsub(req, res, path, title)
{
	var Post = mongoose.model('Post');
	path.push(title);
	console.log(path);
	Post.find({'path': path, 'title': 'NONE'}, function(err, post)
	{
		if (err) console.log('Error while searching sub post' + err);
		else
		{
			console.log(post);
		}
	});
}

exports.edit_db = function(req, res, path, title)
{
	editsub(req, res, path.slice(0), title);
	var Post = mongoose.model('Post');
	Post.update({'path': path, 'title': title}
		,{$set: {title: req.body.postc.title, content: req.body.postc.content}}
		, function(err, post)
	{
		if (err) console.log('Error editing data: ' + err);
		else
		{
			console.log('Edit: DONE');
			path.length -= 1;
			res.render('index.ejs', {'page': 'forum', 'logged': req.Identity.user
					, 'group': req.Identity.group, 'post_list': post
					, 'path': path});
		}
	});
}

exports.deleteOne = function(req, res, path, title)
{
	var Post = mongoose.model('Post');
	Post.remove({'path': path, 'title': title}, function(err, post)
	{
		if (err) console.log('Error deleting post: ' + err);
		else
		{
			console.log('Delete: DONE')
			path.length -= 1;
			res.render('index.ejs', {'page': 'forum', 'logged': req.Identity.user
					, 'group': req.Identity.group, 'post_list': post
					, 'path': path});
		}
	});
}

exports.postTicket = function(req, res)
{
	var Post = mongoose.model('Post');
	if (req.Identity.user != undefined)
	{
		var post_to_insert = new Post
		({
			title: req.body.post.title,
			content: req.body.text_reply,
			path: 'ticket',
			author: req.Identity.user,
			date: new Date(),
			id_p: 0
		});
		console.log(post_to_insert);
		post_to_insert.save(
			function (err)
			{
				if (err) console.error(err);
				else console.log('ticket: DONE');
			});
	}
	res.redirect('/ticket');
}
