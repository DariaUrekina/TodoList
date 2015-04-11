var User = require('./models/user.js');
function Socket(server) { //создать функцию которая создаст сокет  сервер в которую передаются сервер экспресс
	var users = {};
	var io = require('socket.io').listen(server);		
	io.on('connection', function(socket) {	

		console.log('websocket connection start');

		socket.on('SharingList', function(data) {
			users[data.email] = {
				'socket' : 	socket.id
			}
			console.log('socket.id')
			console.log(socket.id);

		});
	   
	});    

}
module.exports = Socket; 	
