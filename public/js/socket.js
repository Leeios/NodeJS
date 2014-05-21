var socket = io.connect('http://nodejs.local.42.fr:3000');
var canvas;
var context;
var id;

function	main_call(login)
{
	socket.emit('login', login);
	if(!(canvas = document.getElementById('canvas')))
	{
		console.log("Impossible to get canvas");
		return;
	}
	if(!(context = canvas.getContext('2d')))
	{
		console.log("Impossible to get canvas context");
		return;
	}
	canvas.width = canvas.width;
	draw_map();
	s_listen();
	canvas.addEventListener("click", client_click, false);
	canvas.addEventListener( "keydown", client_key, true);
}

//SOCKET EMIT
function	client_click(event)
{
	var rect = canvas.getBoundingClientRect();
	var x = event.x - rect.left;
	var y = event.y - rect.top;

	console.log('client_event');
	socket.emit('click', {'x': x, 'y':y});
}

function	client_key(event)
{
	if (event.keyCode == 87)//W
		socket.emit('move', 'u');
	else if (event.keyCode == 83)//S
		socket.emit('move', 'd');
	else if (event.keyCode == 65)//A
		socket.emit('move', 'l');
	else if (event.keyCode == 68)//D
		socket.emit('move', 'r');
}

//SOCKET SECONDARY
function	s_click(data)
{
	console.log(data);
	if (data['o'] == 'm')
		draw_circle(data['x'], data['y'], '#009955');
	else
		draw_circle(data['x'], data['y'], '#FF0055');
}

//SOCKET ON
function	s_listen()
{
	socket.on('click', s_click);
	socket.on('message', function(mes){
		console.log('Server respond : ' + mes);
	});
	socket.on('new_player', function(data){
		draw_char(data);
	});
}

//MAIN DRAW
function	draw_map()
{
	grass_img = new Image();
	grass_img.src = 'public/img/grass.png';
	grass_img.onload = function(){
		for (var i = 0; i < canvas.height / 32; i++)
		{
			for (var j = 0; j < canvas.width / 32; j++)
				context.drawImage(grass_img
					, j * 32, i * 32, 32, 32);
		}
	}
}

function	draw_char(obj)
{
	charac = new Image();
	if (obj.type == 'tank')
		charac.src = 'public/img/char_knight.png';
	else if (obj.type == 'heal')
		charac.src = 'public/img/priest.png';
	charac.onload = function(){
		context.drawImage(charac
		, obj.x
		, obj.y
		, 42, 42);
	}
}

//Draw functions
function	draw_circle(x, y, color)
{
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, 2, 0, Math.PI * 2, true);
	context.fill();
	context.stroke();
}
function	draw_rectangle(x, y, size, color)
{
	context.fillStyle = color;
	context.beginPath();
	context.fillRect(y * (canvas.width / 150), x * (canvas.height / 100)
		, size, size);
	context.fill();
	context.stroke();
}
