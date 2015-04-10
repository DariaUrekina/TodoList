function Socket(server) { //создать функцию которая создаст сокет  сервер в которую передаются сервер экспресс
	var io = require('socket.io').listen(server);
	
	var users=[];
	io.on('connection', function(socket) {
		console.log('websocket connection start');
		socket.on('SharingList', function(data) {
			console.log('user2');
	      	User.find({'email': data.email}, function(err, user) {  
	      		console.log(data.email); 
	      		console.log('user');   
		        if(err) return next(err);
		        res.send('shared');       
		    }); 
	    });		
	});    

}
module.exports = Socket;

 	