var username = "default";
var socket = io.connect();
socket.on('message', function(message) {
    console.log('Server message: ' + message);
})
socket.on('game_state_update', function(message) {
    gameArea.drawFrame(message);
})

$('#join').click(function () {
	username = prompt('What is your username?');
	socket.emit('new_user', username);
	sendCommand("up");
})

var up = new Image;
up.src = "player.png";
var down = new Image;
down.src = "down.png";
var left = new Image;
left.src = "left.png";
var right= new Image;
right.src = "right.png";

var lastFrameRenderTime = new Date().getTime();
var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - ($('#joinButton').height() * 3.2);
        this.context = this.canvas.getContext("2d");
        this.canvas.style.display = "block";
        document.body.style.margin = "20";
        document.body.appendChild(this.canvas, document.body.childNodes[0]);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawFrame : function(json) {
    	this.context.save();
		this.clear();
		this.context.fillStyle = "rgb(65, 191, 74)";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		for(var i=0;i<json.length;i++){
			var X = 8*(json[i].x) + this.canvas.width/2;
			var Y = 8*(json[i].y) + this.canvas.height/2;
			
			switch (json[i].direction){
				case "up":
					this.context.drawImage(up,X-(up.width*0.4/2),Y-(up.height*0.4/2),(up.width*0.4),(up.height*0.4));
					break;
				case "down":
					this.context.drawImage(down,X-(down.width*0.4/2),Y-(down.height*0.4/2),(down.width*0.4),(down.height*0.4));
					break;
				case "left":
					this.context.drawImage(left,X-(left.width*0.4/2),Y-(left.height*0.4/2),(left.width*0.4),(left.height*0.4));
					break;
				case "right":
					this.context.drawImage(right,X-(right.width*0.4/2),Y-(right.height*0.4/2),(right.width*0.4),(right.height*0.4));
					break;
				default: 
					console.log('Unknown Direction Recieved');
			}
		}
		this.context.restore(); 
    }
}

gameArea.start();

function sendCommand(dir){
	var thisFrameRenderTime = new Date().getTime();
	if(thisFrameRenderTime-lastFrameRenderTime > (1000/33)){
		var data = JSON.stringify({"player": username, "direction": dir});
		socket.emit('client_update', data);;
		lastFrameRenderTime = thisFrameRenderTime;
	}
}

window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 87) { //up key w
        sendCommand("up");
    } else if (code === 83) { //down key s
        sendCommand("down");
    } else if (code === 65) { //left key a
        sendCommand("left");
    } else if (code === 68) { //right key d
        sendCommand("right");
    }
};