const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var HashMap = require('hashmap');
var gameState = new HashMap();
var lastFrameRenderTime = new Date().getTime();

io.sockets.on('connection', function (socket, username) {
    socket.emit('message', 'You are connected!');
    socket.broadcast.emit('message', 'Another client has just connected!');
    socket.on('new_user', function(username) {
        socket.username = username;
    });

    socket.on('message', function (message) {
        console.log('User:' + socket.username + ' Message:' + message);
    }); 

    socket.on('client_update', function (message) {
        //console.log('User:' + socket.username + ' Message:' + message);
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
    })

    setInterval(broadcastGameState,1000/30);
    function broadcastGameState(){
        socket.broadcast.emit('game_state_update', gameState.values());
    }
});

app.use(express.static('public'));
server.listen(8080,  () => console.log('Server listening on port 8080!'));