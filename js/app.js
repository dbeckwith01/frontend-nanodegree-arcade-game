const ENEMY_START_LOCATION_X = -101;
const ENEMY_END_LOCATION_X = 505;
const PLAYER_START_LOCATION_POINT_X = 202;
const PLAYER_START_LOCATION_POINT_Y = 400;
let score = 0;
let lives = 3;
let difficulty = 1;

/* !!!!!! Enemy Class !!!!!! */
class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = "images/enemy-bug.png";
  }

  static randomizeSpeed() {
    return parseInt(Math.random() * 100) + 80 * difficulty;
  }

  // Move the enemy to the right across the canvas once it is off screen, send it back to the start with a new random speed
  update(dt) {
    if (lives > 0) {
      if (this.x < ENEMY_END_LOCATION_X) {
        this.x = this.x + this.speed * dt;
      } else {
        this.speed = Enemy.randomizeSpeed();
        this.x = ENEMY_START_LOCATION_X;
      }

      this.checkCollision();
    } else {
      this.x = ENEMY_START_LOCATION_X;
    }
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Check for collision. Used algorthm from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  checkCollision() {
    // Set hitboxes for collision detection
    const playerBox = { x: player.x, y: player.y, width: 60, height: 42 };
    const enemyBox = { x: this.x, y: this.y, width: 50, height: 70 };
    // Check for collisions, if playerBox intersects enemyBox, we have one
    if (
      playerBox.x < enemyBox.x + enemyBox.width &&
      playerBox.x + playerBox.width > enemyBox.x &&
      playerBox.y < enemyBox.y + enemyBox.height &&
      playerBox.height + playerBox.y > enemyBox.y
    ) {
      // Collision detected, call collisionDetected function
      this.collisionDetected();
    }
  }

  collisionDetected() {
    if (lives > 0) {
      lives -= 1;
    }
    document.querySelector(".lives").innerText = `LIVES: ${lives}`;
    gameReset();
  }
}
/* !!!!!! Player Class !!!!!! */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = "images/char-boy.png";
  }

  reset() {
    this.x = PLAYER_START_LOCATION_POINT_X;
    this.y = PLAYER_START_LOCATION_POINT_Y;
  }

  update(dt) {}

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(allowedKey) {
    switch (allowedKey) {
      case "left":
        if (this.x > 0) {
          this.x -= 101; //move left one whole block width
        }
        break;
      case "up":
        //TODO Fix this, it's not correct
        if (this.y > 0) {
          this.y -= 83; //move up toward the water by ~half of one block height
        } else {
          gameLevelUp();
        }
        break;
      case "right":
        if (this.x < 404) {
          this.x += 101; //move right one whole block width
        }
        break;
      case "down":
        if (this.y < 400) {
          this.y += 83;
        }
        break;
    }
  }
}

/* !!!!!! Instantiate Objects !!!!!! */
const allEnemies = [];

for (let i = 0; i < 3; i++) {
  allEnemies.push(
    new Enemy(ENEMY_START_LOCATION_X, 60 + 83 * i, Enemy.randomizeSpeed())
  ); // place enemies off screen along 3 stone blocks at y locations 60, 145, and 228 with a random speed
}

const player = new Player(
  PLAYER_START_LOCATION_POINT_X,
  PLAYER_START_LOCATION_POINT_Y
);

const gameReset = () => {
  player.reset();
};

const gameLevelUp = () => {
  score += 1;
  difficulty += 1;
  document.querySelector(".score").innerText = `SCORE: ${score}`;
  document.querySelector(".difficulty").innerText = `DIFFICULTY: ${difficulty}`;
  player.reset();
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  const allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
