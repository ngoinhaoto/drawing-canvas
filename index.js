let myGamePiece;
let myObstacles = [];
let myScore;

function startGame() {
  // Increase the size of the game piece
  myGamePiece = new component(60, 60, "megaman.png", 30, 240, "image");
  myGamePiece.gravity = 0.1; // Adjust gravity for larger size
  // Increase font size for score
  myScore = new component("60px", "Consolas", "black", 560, 80, "text");
  myGameArea.start();
}
let myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 960;
    this.canvas.height = 540;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  stop: function () {
    clearInterval(this.interval);
  },
};

function component(width, height, color, x, y, type) {
  this.type = type;
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;

  this.gravity = 0;
  this.gravitySpeed = 0;

  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }

  this.update = function () {
    ctx = myGameArea.context;
    if (this.type == "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
  };

  this.newPos = function () {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
  };

  this.hitBottom = function () {
    var rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = 0;
    }
  };

  this.crashWith = function (otherobj) {
    let myleft = this.x;
    let myright = this.x + this.width;

    let mytop = this.y;
    let mybottom = this.y + this.height;

    let otherleft = otherobj.x;
    let otherright = otherobj.x + otherobj.width;

    let othertop = otherobj.y;
    let otherbottom = otherobj.y + otherobj.height;

    let crash = true;

    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }

    return crash;
  };
}

function updateGameArea() {
  let x, height, gap, minHeight, maxHeight, minGap, maxGap;

  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      return;
    }
  }

  myGameArea.clear();
  myGameArea.frameNo += 1;

  if (myGameArea.frameNo == 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;

    height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight,
    );

    minGap = 50;
    maxGap = 500;

    gap = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight); // gap between each obstacle
    myObstacles.push(new component(25, height, "blue", x, 0));
    myObstacles.push(
      new component(25, x - height - gap, "blue", x, height + gap),
    );
  }

  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  myScore.text = "SCORE: " + myGameArea.frameNo;
  myScore.update();
  myGamePiece.newPos();
  myGamePiece.update();
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

function accelerate(n) {
  myGamePiece.gravity = n;
}

function restartGame() {
  myGameArea.stop(); // stop game loop
  myObstacles = []; // Reset obstacles
  myGameArea.clear(); // clear game area
  startGame(); // Restart the game
}
