var theBall;

var clone;

var paddleLeft;
var paddleRight;

var ballSpeed = 9;

//ArrayOfKeys
var keys = [false, false];

function setup() {

	createCanvas(600, 500);		//createCanvas defines width and height for you ;)

	theBall = new Ball(ballSpeed);
	theBall.calcVelocity();

	clone = new Ball(ballSpeed + 20);

	if (theBall.angle > 90 && theBall.angle < 270) {
		clone.xspeed = clone.speed*(Math.cos(toRad(theBall.angle)));
		clone.yspeed = clone.speed*(Math.sin(toRad(theBall.angle)));		
	}

	paddleLeft = new Paddle("left");
	paddleRight = new Paddle("right");
	paddleLeft.chooseSide();
	paddleRight.chooseSide();

}

function draw() {

	background(51);		//Background Color on Grayscale
	drawNet();

	theBall.move();
	theBall.checkBoundaries();
	theBall.checkScored();
	theBall.checkCollisionPaddleRight();
	theBall.checkCollisionPaddleLeft();
	theBall.display();

	clone.move();
	clone.checkBoundaries();
	clone.stopClone();
	//clone.display();			//Display For Debugging Purposes

	checkKeys();

	paddleRight.update()
	paddleRight.display();
	paddleRight.displayScore();

	paddleLeft.ai();
	paddleLeft.update();
	paddleLeft.display();
	paddleLeft.displayScore();

}

function keyPressed() {
	if(keyCode == UP_ARROW) {
		keys[0] = true;
	}
	if(keyCode == DOWN_ARROW) {
		keys[1] = true;
	}
}

function keyReleased() {
	if(keyCode == UP_ARROW) {
		keys[0] = false;
	}
	if(keyCode == DOWN_ARROW) {
		keys[1] = false;
	}
}

function checkKeys() {
	if (keys[0]) {
		paddleRight.movement = -8;
	}
	if (keys[1]){
		paddleRight.movement = 8;
	}
	if (!keys[0] && !keys[1]) {
		paddleRight.movement = 0;
	}
}

function drawNet() {
	for (i=0; i < 11; i++) {
		rect(width/2, i*50, 3, 20);
	}
}

function toRad(angle) {
	return angle * (Math.PI/180);
}

//Ball class
function Ball(s) {
	this.x = width/2;
	this.y = height/2;
	this.diameter = 15;
	this.radius = this.diameter/2;
	this.xspeed = 0;
	this.yspeed = 0;
	this.speed = s;
	this.angle = random([Math.floor(random(0, 10)), Math.floor(random(170, 190)), Math.floor(random(350, 360))]);
	this.cloneOnSide = false;

	this.move = function() {
		this.x += this.xspeed;
		this.y += this.yspeed;
	}

	this.calcVelocity = function() {
		this.xspeed = this.speed*(Math.cos(toRad(this.angle)));
		this.yspeed = this.speed*(Math.sin(toRad(this.angle)));
	}

	this.checkBoundaries = function() {
		if(((this.y-(this.diameter/2) <= 0)) || (this.y+(this.diameter/2) >= height)) {
			this.yspeed = -this.yspeed;
		}
	}
	this.checkScored = function() {
		if ((this.x-(this.diameter/2) <= 0)) {
			paddleRight.score += 1;
			this.x = width/2
			this.y = height/2
			this.angle = random([Math.floor(random(0, 10)), Math.floor(random(170, 190)), Math.floor(random(350, 360))]);
			this.calcVelocity();

			clone.cloneOnSide = false;
			clone.x = this.x;
			clone.y = this.y;

			if (this.angle > 90 && this.angle < 270) {
				clone.xspeed = clone.speed*(Math.cos(toRad(theBall.angle)));
				clone.yspeed = clone.speed*(Math.sin(toRad(theBall.angle)));		
			}
		}
		if ((this.x+(this.diameter/2) >= width)) {
			paddleLeft.score += 1;
			this.x = width/2
			this.y = height/2
			this.angle = random([Math.floor(random(0, 10)), Math.floor(random(170, 190)), Math.floor(random(350, 360))]);
			this.calcVelocity();

			clone.cloneOnSide = false;
			clone.x = this.x;
			clone.y = this.y;

			if (this.angle > 90 && this.angle < 270) {
				clone.xspeed = clone.speed*(Math.cos(toRad(theBall.angle)));
				clone.yspeed = clone.speed*(Math.sin(toRad(theBall.angle)));		
			}
		}
	}

	this.checkCollisionPaddleRight = function() {
		if (this.x >= (paddleRight.x - (paddleRight.width/2))) {
			if (((this.y+this.radius) >= paddleRight.t) && ((this.y-this.radius) <= paddleRight.b)) {

				var relativeYIntersect = this.y - paddleRight.y;
				var normalizedRYI = (relativeYIntersect/(paddleRight.height/2));
				var bounceAngle = normalizedRYI*40;

				this.xspeed = this.speed*(-(Math.cos(toRad(bounceAngle))));
				this.yspeed = this.speed*((Math.sin(toRad(bounceAngle))));

				clone.x = this.x;
				clone.y = this.y;

				clone.xspeed = clone.speed*(-(Math.cos(toRad(bounceAngle))));
				clone.yspeed = clone.speed*((Math.sin(toRad(bounceAngle))));

			}
		}
	}

	this.checkCollisionPaddleLeft = function() {
		if (this.x <= (paddleLeft.x + (paddleLeft.width/2))) {
			if (((this.y+this.radius) >= paddleLeft.t) && ((this.y-this.radius) <= paddleLeft.b)) {

				var relativeYIntersect = this.y - paddleLeft.y;
				var normalizedRYI = (relativeYIntersect/(paddleLeft.height/2));
				var bounceAngle = normalizedRYI*40;

				this.xspeed = this.speed*((Math.cos(toRad(bounceAngle))));
				this.yspeed = this.speed*((Math.sin(toRad(bounceAngle))));

				clone.x = width/2;
				clone.y = height/2;
				clone.xspeed = 0;
				clone.yspeed = 0;
				clone.cloneOnSide = false;

			}
		}
	}

	this.stopClone = function() {
		if ((this.x-this.radius) <= (paddleLeft.x + (paddleLeft.width/2))) {
			this.xspeed = 0;
			this.yspeed = 0;
			this.cloneOnSide = true;
		}
	}

	this.display = function() {
		ellipse(this.x, this.y, this.diameter);
	}
}

//Paddle class
function Paddle(side) {
	this.x;
	this.y = height/2;
	this.width = 15;
	this.height = height/5;
	this.side = side;
	this.movement = 0;
	this.t;
	this.b;
	this.score = 0;

	this.chooseSide = function() {
		if (this.side == "left") {
			this.x = this.width+6;
		}
		else if (this.side == "right") {
			this.x = width-(this.width+6);
		}
	}

	this.display = function() {
		fill(255, 255, 255);
		rectMode(CENTER);
		rect(this.x, this.y, this. width, this.height);
	}

	this.displayScore = function() {
		if (this.side == "left") {
			rectMode(CORNER);
			textAlign(LEFT);
			text(this.score.toString(), 50, 50, 50, 50);	
		}
		else if (this.side == "right") {
			rectMode(CORNER);
			textAlign(LEFT);
			text(this.score.toString(), width-50, 50, 50, 50);
		}		
	}

	this.update = function() {
		this.t = (this.y - (this.height/2));
		this.b = (this.y + (this.height/2));
		if ((this.t >= 0) && (this.movement < 0) || (this.b <= height) && (this.movement > 0)) {
			this.y += this.movement;
		}
	}

	this.ai = function() {
		var clonev;
		var paddlev;

		var centering;

		var speedCap = 2.5;

		clonev = createVector(clone.x, clone.y);
		paddlev = createVector(paddleLeft.x, paddleLeft.y);
		centering = createVector(6+(this.width), height/2);

		var difv;
		difv = p5.Vector.sub(clonev, paddlev);

		var centeringDifv;
		centeringDifv = p5.Vector.sub(centering, paddlev);

		if (clone.cloneOnSide) {
			if (clone.y < paddleLeft.y) {
				var recommendedNegSpeed = -.03*(difv.mag());
				if (recommendedNegSpeed >= -speedCap) {
					paddleLeft.movement = recommendedNegSpeed;
				} else {
					paddleLeft.movement = -speedCap;
				}

			}
			else if (clone.y > paddleLeft.y) {
				var recommendedSpeed = .03*(difv.mag());
				if (recommendedSpeed <= speedCap) {
					paddleLeft.movement = recommendedSpeed;			
				} else {
					paddleLeft.movement = speedCap;
				} 
			}
		}
		else if (!clone.cloneOnSide) {
			if (paddleLeft.y < height/2) {
				paddleLeft.movement = .03*(centeringDifv.mag());
			} else {
				paddleLeft.movement = -.03*(centeringDifv.mag());
			}
		}
	}
}