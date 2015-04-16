'use strict';


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update,render: render});

function preload() {

game.load.audio('music','assets/scary.mp3');
game.load.audio('jump','assets/jump.mp3');
game.load.image('city', 'assets/jail.jpg');
game.load.image('ground','assets/platforms.png');    
game.load.image('spike','assets/spike.png');
game.load.image('prisoner','assets/prisoner.png');
game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
game.load.spritesheet('police', 'assets/pol.png', 32,50 );
game.load.spritesheet('mouse', 'assets/mouse.png', 50,50);


   game.load.image('bullet', 'assets/rock.png');
    game.load.image('enemyBullet', 'assets/rock.png');
    game.load.spritesheet('invader', 'assets/bat.png', 37, 47);



}

var player;
var keys = Phaser.Keyboard;
var platforms;
var polices;
var music;
var jump;
var world;
var mouse;
var mice;

var background;
var ground;
var spikes;
var trap;
var prisoner;
var prisonerBody;
var stateText;
var time;
var style;
var end=false;


var aliens;
var enemyBullet;
var enemyBullets;
var range;
var livingEnemies = [];
var firingTimer = 0;

var number=1;


var bullets;
var bulletTime = 0;
var bullet;
var fireButton;
function create(){
    music = game.add.audio('music');
    music.volume = 0.3;
    music.loop = true;
    music.play();
    jump = game.add.audio('jump');
    style = { font: "150px Arial", fill: "#ff0044", align: "center" };

    game.physics.startSystem(Phaser.Physics.ARCADE);


    background = game.add.tileSprite(0,0, 2500, 597, 'city');
    

	

    prisonerBody = game.add.group();
    prisonerBody.enableBody = true;
	
		prisoner = prisonerBody.create(2300, 210, 'prisoner');
        		prisoner.scale.setTo(.1, .1);
					prisoner.body.immovable = true;
   
   
   
    platforms = game.add.group();
    platforms.enableBody = true;
	
	spikes = game.add.group();
	 spikes.enableBody = true;
   
  
    map(platforms);

    
    player = game.add.sprite(32, game.world.height - 150, 'police');
    game.physics.arcade.enable(player);
   
    player.body.bounce.y = 0.2;
    player.body.gravity.y  = 400;
    player.body.collideWorldBounds = true;
    

	player.animations.add('stand', [0,1,2,3], 10, true);
    player.animations.add('left', [4, 5, 6, 7], 10, true);
    player.animations.add('right', [8, 9, 10, 11], 10, true);


	
  
    mice = game.add.group();
    createmouse();
    

    game.camera.follow(player);
   game.time.events.loop(Phaser.Timer.SECOND, mouseMove, this); 
   
   
   
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
	
	
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);
		
	
	 aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
    createAliens();
	
	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    

}

function createAliens () {

    for (var y = 0; y < 1; y++)
    {
        for (var x = 0; x < number; x++)
        {
            var alien = aliens.create(x * 100, y * 100, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3,4,5,6,7,8 ], 10, true);
            alien.play('fly');
            alien.body.moves = false;
			 alien.checkWorldBounds = true;
			 
		
        }
    }

    aliens.x = 50;
    aliens.y = 50;
	range=1000;



    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: range }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
	
    
	
}
function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    

}

function update(){
   time= (60000-game.time.now)/1000;
    game.physics.arcade.collide(player, platforms);
 
    game.physics.arcade.collide(mice, platforms);

  
    game.physics.arcade.overlap(player, mice, playerKill, null, this);
			    game.physics.arcade.overlap(player, prisonerBody, win, null, this);
		
			    game.physics.arcade.overlap(player, spikes, playerDie, null, this);
				game.physics.arcade.overlap(player, aliens, playerDeath, null, this);
				
    
    player.body.velocity.x = 0;

    if (game.input.keyboard.isDown(keys.LEFT))
    {
	player.body.velocity.x = -175;
	player.animations.play('left');
    }
    else if (game.input.keyboard.isDown(keys.RIGHT))
    {
	player.body.velocity.x = 175;
	player.animations.play('right');
    }
    else if (game.input.keyboard.isDown(keys.UP))
    {
	player.body.velocity.x = 0;
	player.animations.play('stand');
	
	player.frame = 6;
    }

    if (game.input.keyboard.isDown(keys.UP) && player.body.touching.down)
    {
	jump.volume = 0.5;
	jump.play();
	player.body.velocity.y = -425;


    }
	 if (player.body.onFloor())
    {
player.reset(32, game.world.height - 150);


    }
	if(time<0&&end!=true)
	{
	time=0;
	stateText=game.add.text(game.world.centerX, game.world.centerY,  " You missed the prisoner! \n Press F5 to restart", style);
	 stateText.anchor.setTo( 0.5, 0.5);
	 prisoner.visible=false;
}
	
	    if (game.time.now > firingTimer)
        {
            enemyFires();
        }
		
		 if (fireButton.isDown)
        {
            fireBullet();
        }
     game.physics.arcade.overlap(bullets, mice, collisionHandler, null, this);
game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

}

function collisionHandler (bullet, mice) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    mice.kill();

   



}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x+8, player.y+35);
            bullet.body.velocity.x = 200;
            bulletTime = game.time.now + 1500;
        }
    }

}
function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

   player.reset(32, game.world.height - 150);
 



}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,100);
        firingTimer = game.time.now + 3000;
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}
function lockOnFollow() {
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
}

function map(platforms) {


    game.world.setBounds(0,0, 2500, 597);

    var plat = platforms.create(350, 400, 'ground');
    plat.body.immovable = true;
	
	trap = spikes.create(450, 350, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;
	
	    plat = platforms.create(50, 500, 'ground');
    plat.body.immovable = true;
	plat.scale.setTo(.5,1);
	


    plat = platforms.create(650, 250, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(750, 200, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

    plat = platforms.create(200, 150, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(350, 100, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;
    
	var plat = platforms.create(1100, 225, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(1250, 175, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

    plat = platforms.create(1400, 255, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(1500, 205, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

    plat = platforms.create(1900, 350, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(2100, 300, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;
	
	    plat = platforms.create(2000, 250, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(2100, 200, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

}










function createmouse() {

    for (var i=0; i<10; i++) {
	mouse = mice.create(game.rnd.integerInRange(200, 2000), game.rnd.integerInRange(100, 200), 'mouse');
	game.physics.arcade.enable(mouse);
	mouse.body.gravity.y = 300;
	mouse.body.collideWorldBounds = true;
	mouse.animations.add('left',[4,5,6,7],10,true);
	mouse.animations.add('right',[8,9,10,11], 10, true);

	}
}

function playerKill(player, mice) {

   
   
	player.reset(32, game.world.height - 150);
    
}

function playerDeath(player, alien) {

   
   
	player.reset(32, game.world.height - 150);
    
}

function playerDie(player, spikes) {


	player.reset(32, game.world.height - 150);
    
}

function win(player, prisonerBody) {



	
	 stateText=game.add.text(game.world.centerX, game.world.centerY,  " You caught the prisoner in time! \n Press F5 to restart", style);

  stateText.anchor.setTo( 0.5, 0.5);
      end=true;
}



function mouseMove ()
    {
	

	mice.forEach(function(mouse) {
	
	 if (mouse.body.onFloor())
    {
mouse.kill();

    }
    var x = Math.round(Math.random());
    if(x == 1)
    {
	if(mouse.body.touching.down)
	{
	    	mouse.animations.play('left');
	mouse.body.velocity.x = -50;
	}
	
	

	
    }
	    if(x == 0)
	    {
	if(mouse.body.touching.down)
	{
	    mouse.animations.play('right');
	mouse.body.velocity.x = 50;
	}
	
    }
	}, this);
    }

	 function render() {    

		game.debug.text('Time remaining to catch: ' +time+' seconds', 0, 50);
	
    }








