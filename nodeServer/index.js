// index.js
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
express.static("C:\\nodeServer\\public");
var HashMap = require('hashmap');
var gameState = new HashMap();

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  console.log(req.body);
  res.send('Game Server Online!')
})

// Get GameState endpoint
app.get('/gamestate', function (req, res) {
  //console.log("Recieved Request for Payload");
  res.json(gameState.values());
})

// Create Update endpoint
app.post('/update', function (req, res) {
  var payload = req.body;
  //console.log("Recieved Payload : ", payload);

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
  res.json(gameState.values());
})

app.use(express.static('public'));
app.listen(80, () => console.log('Example app listening on port 80!'));