var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, ground_image, invisible_ground;
var girl, girl_running, girl_collided, girlImage, zombie, zombie_running, zombie_attack;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var score;
var gameOver, restart, gameOverImage, restartImage;

function preload() {
  ground_image = loadImage("Background.png");
  girl_running = loadAnimation("player_img.png");
  zombie_running = loadAnimation("Walk (1).png");
  zombie_attack = loadAnimation("Attack (7).png");
  obstacle1 = loadImage("obstacle1.png");
  zombie_idle = loadImage("Stand.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("death.mp3")
  gameOverImage = loadImage("gameOver1.png");
  restartImage = loadImage("restart1.png");
  girl_collided = loadImage("Dead (30).png");
 
}

function setup() {
  createCanvas(600, 500);

  ground = createSprite(0, 0, 0, 0);
  ground.shapeColor = "white";
  ground.addImage("ground_image", ground_image);
  ground.scale = 1.4;
  ground.velocityX = -1

  player = createSprite(300, 400, 600, 10);
  player.addAnimation("girl_running", girl_running);
  player.addImage("girl_collided", girl_collided);
  
  player.scale = 0.05;
 
  player.debug = true;
  player.setCollider("rectangle", 0, 0, girl.width, girl.height)


  zombie = createSprite(60, 440, 600, 10);
  zombie.addAnimation("zombie_running", zombie_running);
  zombie.addAnimation("zombie_attack", zombie_attack);
  zombie.scale = 0.2;
  zombie.debug = false;
  

  invisible_ground = createSprite(300, 470, 600, 10);
  invisible_ground.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImage);

  restart = createSprite(300, 180);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background("black");

  
  player.velocityY = player.velocityY + 0.8;
  player.collide(invisible_ground);

 
  zombie.velocityY = zombie.velocityY + 0.8;
  zombie.collide(invisible_ground);


  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    
    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();
    if (obstaclesGroup.isTouching(zombie)) {
      zombie.velocityY = -12;
    }
    ground.velocityX = -(4 + 3 * score / 100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
     
    }

    if ((keyDown("space") && girl.y >= 220)) {
      girl.velocityY = -12;
      jumpSound.play();
    }

    if (girl.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    girl.velocityY = 0
    girl.changeImage("girlImage", girlImage);
    zombie.changeAnimation("zombie_attack", zombie_attack);
    zombie.x = girl.x;
    if (zombie.isTouching(girl)) {
      girl.changeImage("girl_collided", girl_collided);
      zombie.changeImage("zombie_idle", zombie_idle);
    }
   
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
  fill("red");
  textSize(20);
  text("Score: " + score, 500, 50);
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  girl.changeAnimation("girl_running", girl_running);
  obstaclesGroup.destroyEach();
  score = 0;
  zombie.x = 50;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 450, 10, 40);
    obstacle.velocityX = -6; 

    
    var rand = Math.round(random(1, 6));
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.1;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle", 0, 0, 1);
  }

}