const express = require('express');
var app = express();
var server = require('http').Server(app);
// Loading socket.io
var io = require('socket.io').listen(server);

var HashMap = require('hashmap');
var gameState = new HashMap();

io.sockets.on('connection', function (socket, username) {
    // When the client connects, they are sent a message
    socket.emit('message', 'You are connected!');
    // The other clients are told that someone new has arrived
    socket.broadcast.emit('message', 'Another client has just connected!');

    // As soon as the username is received, it's stored as a session variable
    socket.on('new_user', function(username) {
        socket.username = username;
    });

    // When a "message" is received (click on the button), it's logged in the console
    socket.on('message', function (message) {
        // The username of the person who clicked is retrieved from the session variables
        console.log('User:' + socket.username + ' Message:' + message);
    }); 

    socket.on('client_update', function (message) {
        console.log('User:' + socket.username + ' Message:' + message);
        var payload = JSON.parse(message);
        if(!gameState.has(payload.player)){
          var playerState = 
            {
              player: payload.player, 
              direction: payload.direction , 
              x:0,
              y:0
            };
          gameState.set(payload.player, playerState );
        }
        var playerState = gameState.get(payload.player);
        playerState.direction = payload.direction;
        switch (playerState.direction)
        {
           case "up":
              playerState.y -= 1;
              break;
           case "down":
              playerState.y += 1;
              break;
           case "left":
              playerState.x -= 1;
              break;
           case "right":
              playerState.x += 1; 
              break;
           default: 
               console.log('Unknown Direction Recieved');
        }
        gameState.set(payload.player, playerState);
        console.log("Return Payload : ", gameState.values());
        socket.emit('game_state_update', gameState.values());
    })
});

app.use(express.static('public'));
server.listen(80,  () => console.log('Server listening on port 80!'));