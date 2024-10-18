let myGamePiece;
let myObstacles = [];
let myScore;
let obstacleInterval;

// Function to return a random interval between 150 and 400
function getRandomInterval() {
  return Math.floor(Math.random() * (400 - 150 + 1) + 150);
}

function startGame() {
  // Increase the size of the game piece
  myGamePiece = new component(40, 40, "mario-still.png", 30, 240, "image");
  myScore = new component("35px", "Consolas", "black", 750, 60, "text");
  myGameArea.start();

  window.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "w":
        moveup();
        break;
      case "a":
        moveleft();
        break;
      case "s":
        movedown();
        break;
      case "d":
        moveright();
        break;
    }
  });

  window.addEventListener("keyup", function (e) {
    clearmove();
  });
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
    // update the position with speed values
    this.x += this.speedX;
    this.y += this.speedY;

    // stop character from going past canvas width
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > myGameArea.canvas.width - this.width) {
      this.x = myGameArea.canvas.width - this.width;
    }

    // stop character from going past canvas height
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y > myGameArea.canvas.height - this.height) {
      this.y = myGameArea.canvas.height - this.height;
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

  if (myGameArea.frameNo == 1 || everyinterval(200)) {
    x = myGameArea.canvas.width;
    minHeight = 80;
    maxHeight = 200;

    height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight,
    );

    minGap = 300;
    maxGap = 500;

    gap = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight); // gap between each obstacle
    myObstacles.push(new component(30, height, "blue", x, 0));
    myObstacles.push(
      new component(30, x - height - gap, "blue", x, height + gap),
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

function restartGame() {
  myGameArea.stop(); // stop game loop
  myObstacles = []; // Reset obstacles
  myGameArea.clear(); // clear game area
  startGame(); // Restart the game
}

function moveup() {
  myGamePiece.speedY -= 3;
  myGamePiece.image.src = "mario-moving.png";
}

function movedown() {
  myGamePiece.speedY += 3;
  myGamePiece.image.src = "mario-moving.png";
}

function moveleft() {
  myGamePiece.speedX -= 3;
  myGamePiece.image.src = "mario-moving.png";
}

function moveright() {
  myGamePiece.speedX += 3;
  myGamePiece.image.src = "mario-moving.png";
}

function clearmove() {
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  myGamePiece.image.src = "mario-still.png";
}
