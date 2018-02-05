var socket = io.connect('http://localhost:80');
// The visitor is asked for their username...
var username = prompt('What is your username?');
// It's sent with the signal "little_newbie" (to differentiate it from "message")
socket.emit('new_user', username);
// A dialog box is displayed when the server sends us a "message"
socket.on('message', function(message) {
    alert('Server response: ' + message);
})
//
socket.on('game_state_update', function(message) {
    drawMultiplePlayers(message);
})

// When the button is clicked, a "message" is sent to the server
$('#ping').click(function () {
    socket.emit('message', 'Client Ping Test');
})

var up = new Image;
up.src = "player.png";
var down = new Image;
down.src = "down.png";
var left = new Image;
left.src = "left.png";
var right= new Image;
right.src = "right.png";

var date = new Date();
var n = date.getTime();

var w = window.innerWidth;
var h = window.innerHeight;
var arena = playArea();

function playArea(){
	var canvas = document.createElement('canvas');
	canvas.style.display = "block";
	canvas.id = "playArea";
	canvas.width = w;
	canvas.height = h;
	document.body.appendChild(canvas);
	document.body.style.margin = "0";
	return canvas;
}

function drawMultiplePlayers(json){
	var ctx = arena.getContext("2d");
	ctx.save(); 
	ctx.clearRect(0, 0, w, h);
	ctx.fillStyle = "rgb(65, 191, 74)";
	ctx.fillRect(0, 0, arena.width, arena.height);
	
	for(var i=0;i<json.length;i++){
		var X = 8*(json[i].x) + w/2;
		var Y = 8*(json[i].y) + h/2;
		
		switch (json[i].direction){
			case "up":
				ctx.drawImage(up,X-(up.width*0.4/2),Y-(up.height*0.4/2),(up.width*0.4),(up.height*0.4));
				break;
			case "down":
				ctx.drawImage(down,X-(down.width*0.4/2),Y-(down.height*0.4/2),(down.width*0.4),(down.height*0.4));
				break;
			case "left":
				ctx.drawImage(left,X-(left.width*0.4/2),Y-(left.height*0.4/2),(left.width*0.4),(left.height*0.4));
				break;
			case "right":
				ctx.drawImage(right,X-(right.width*0.4/2),Y-(right.height*0.4/2),(right.width*0.4),(right.height*0.4));
				break;
			default: 
			console.log('Unknown Direction Recieved');
		}
	}
	ctx.restore(); 
}

function postPlay(dir){
	var date2 = new Date();
	var nplus = date2.getTime();
	if(nplus-n > (1000/10)){
	var data = JSON.stringify({"player": username, "direction": dir});
	socket.emit('client_update', data);;
	n = nplus;
	}
}

window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 87) { //up key w
        postPlay("up");
    } else if (code === 83) { //down key s
        postPlay("down");
    } else if (code === 65) { //left key a
        postPlay("left");
    } else if (code === 68) { //right key d
        postPlay("right");
    }
};