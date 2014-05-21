var mongoose = require('mongoose');

exports.userlist = function(page, req, res){
	var User = mongoose.model('User');
	User.find({}, {login: 1, group:1}, function (err, users) {
	if(err)
		console.log("Get user list:" + err);
	else
	{
		if (page == 'admin')
			res.render('index.ejs', {'page': 'admin', 'user_list': users
				, 'logged': req.Identity.user, 'group': req.Identity.group});
		else if (page == 'list')
			res.render('index.ejs', {'page': 'list', 'user_list': users
				, 'logged': req.Identity.user, 'group': req.Identity.group});
	}
})}
