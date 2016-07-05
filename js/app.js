var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

var ship;
var cursors;
var bullet;
var bullets;
var lives = 3;
var enemies;
var bulletTime = 0;

function preload(){

    game.load.image('space', 'assets/skies/deep-space.jpg');
    game.load.image('bullet', 'assets/games/asteroids/bullets.png');
    game.load.image('ship', 'assets/games/asteroids/ship.png');
    game.load.spritesheet('spinner', 'assets/sprites/bluemetal_32x32x4.png', 32, 32);
    game.load.image('phaser', 'assets/sprites/phaser.png');

}

function create(){

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, 800, 600, 'space');

    ship = game.add.sprite(300, 300, 'ship');

    game.physics.enable(ship, Phaser.Physics.ARCADE);

    ship.anchor.set(0.5);
    ship.body.drag.set(100);
    ship.body.maxVelocity.set(500);

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    for(var i=0; i<30; i++){

        var s = enemies.create(game.rnd.integerInRange(100, 700), game.rnd.integerInRange(32, 200), 'spinner');
        s.animations.add('spin', [0,1,2,3]);
        s.play('spin', 20, true);
        game.physics.enable(s, Phaser.Physics.ARCADE);
        s.body.velocity.x = game.rnd.integerInRange(-200, 200);
        s.body.velocity.y = game.rnd.integerInRange(-200, 200);
        s.data.lives = 2;

    }

    //enemies.setAll('body.collideWorldBounds', true);
    enemies.setAll('body.bounce.x', 1);
    enemies.setAll('body.bounce.y', 1);
    enemies.setAll('body.minBounceVelocity', 0);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

}

function fireBullet(){

    if(game.time.now > bulletTime){

        bullet = bullets.getFirstExists(false);
        if(bullet){

            bullet.reset(ship.body.x+16, ship.body.y+16);
            bullet.lifespan = 2000;
            bullet.rotation = ship.rotation;
            game.physics.arcade.velocityFromRotation(ship.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;

        }

    }

}

function update(){

    if(cursors.up.isDown){
        game.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration);
    }else{
        ship.body.acceleration.set(0);
    }

    if(cursors.left.isDown){
        ship.body.angularVelocity = -300;
    }else if(cursors.right.isDown){
        ship.body.angularVelocity = 300;
    }else{
        ship.body.angularVelocity = 0;
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        fireBullet();
    }

    bullets.forEachExists(screenWrap, this);
    enemies.forEachExists(screenWrap, this);
    screenWrap(ship);

    game.physics.arcade.collide(enemies, ship, enemyHitsShip);
    game.physics.arcade.collide(enemies, bullets, bulletHitsEnemy);
    game.physics.arcade.collide(enemies);

}


function bulletHitsEnemy(enemy, bullet){

    bullet.kill();
    enemy.data.lives = parseInt(enemy.data.lives);
    enemy.data.lives--;

    console.log(enemy);

    if(enemy.data.lives === 0){
        enemy.kill();
    }else {
        enemy.scale.x = 0.5;
    }

}

function enemyHitsShip(ship, enemy){

    lives--;

    if(lives === 0) {
        game.paused = true;
        ship.kill();
    }

}

function screenWrap(sprite){

    if(sprite.x > game.width){
        sprite.x = 0;
    }else if(sprite.x < 0){
        sprite.x = game.width;
    }

    if(sprite.y < 0){
        sprite.y = game.height;
    }else if(sprite.y > game.height){
        sprite.y = 0;
    }

}








