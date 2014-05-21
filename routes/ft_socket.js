/*
** /game
** /auth_socket
** /s_connect
*/

/*___________________________________________*/
/*_________________SOCKET IO_________________*/
/*___________________________________________*/
var Player = require('mongoose').model('Player'),
	User = require('mongoose').model('User');

exports.game = function(req, res)
{
	if (req.Identity.user != undefined)
		res.render('index.ejs', {'page': 'game', 'logged': req.Identity.user
				, 'group': req.Identity.group});
	else
		res.send(401, 'You\'re not allowed to see this page');
}

exports.auth_socket = function (handshake, callback){
	console.log(handshake);
	if (handshake.name == undefined)
		callback(null, false);
	else
		callback(null, true);
}


function static_var()
{
	var id = 0;
	return function(){
		return id++;
	};
}

exports.s_connect = function(socket)
{
	var id_player = 0;//STATIC INCREMENT
	socket.emit('message', 'You\'re connected');
	socket.on('login', function(data){
		socket.broadcast.emit('message', data + ' arrived in the battle');
		User.findOne({login: data}, {login: 1, id_p: 1}, function(err, doc){
			if (err || doc == null) console.log('Can\'t find player in DB');
			else
			{
				console.log('New attribute id '+ id_player);
				doc.id_p = id_player;
				new_player = create_new_player(id_player);
				socket.emit('new_player', new_player);
				socket.broadcast.emit('new_player', new_player);
				Player.find(function(err, doc){
					if (err || doc == null) console.log('Can\'t find player in DB');
					else
					{
						for (var i = 0; doc[i]; i++)
							socket.emit('new_player', doc[i]);
					}
				});
			}
		});
	});
	// socket.on('click', function(data){
	// 	console.log('Client clicked: ', data);
	// 	data['o'] = 'm';
	// 	socket.emit('click', data);
	// 	data['o'] = 'y';
	// 	socket.broadcast.emit('click', data);
	// });
	socket.on('message', function(data){
		console.log('Message from client: ', data);
		socket.broadcast.emit('message', 'Message from other client');
	});
	socket.on('move', function(data)
	{
		Player.update({});
	});
}

function	create_new_player(id)
{
	var new_player;

	if (id % 2 == 0)
	{
		new_player = new Player
		({
			x: Math.floor(Math.random() * 800),
			y: Math.floor(Math.random() * 800),
			hp: 100,
			mp: 20,
			type: 'tank',
			id_p: id
		});
	}
	else
	{
		new_player = new Player
		({
			x: Math.floor(Math.random() * 100),
			y: Math.floor(Math.random() * 100),
			hp: 70,
			mp: 50,
			type: 'heal',
			id_p: id
		});
	}
	new_player.save(
		function (err)
		{
			if (err) console.error(err);
			else console.log('New player ' + id + ': DONE');
		});
	return(new_player);
}
