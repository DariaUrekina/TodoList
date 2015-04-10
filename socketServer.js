function Socket(server) { //создать функцию которая создаст сокет  сервер в которую передаются сервер экспресс
	var io = require('socket.io').listen(server);
	var participants = [];

	io.on("connection", function(socket) {
		socket.on("newUser", function(data) {
    		participants.push({id: data.id, name: data.name});
    		io.sockets.emit("newConnection", {participants: participants});
  		});
	});    

}

module.exports = Socket;
 