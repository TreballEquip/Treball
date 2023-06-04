"use strict";

const ENEMY_VEL = 200
const BG_MAX_VEL = 1
const BG_ACCELERATION = 1.01

class CoheteScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.platforms = null;
		this.player = null;
        this.enemies = null
		this.cursors = null;
		this.stars = null;
		this.score = 0;
		this.scoreText;
		this.bombs = null;
		this.gameOver = false;
        this.gamePaused = false
        this.sky = null;
        this.skySpeed = 0.01;
    }
    preload (){	
        this.load.image('rocket', '../resources/rocket.png');
        this.load.image('sky','../resources/sky.png');
        this.load.image('enemy','../resources/MIERDA.png');

        this.load.spritesheet('Bird_BR',
			'../resources/Pajaritos_brown.png',
			{ frameWidth: 123, frameHeight: 96 }
		);

        this.load.spritesheet('Bird_WH',
			'../resources/Pajaritos_white.png',
			{ frameWidth: 185, frameHeight: 144 }
		);

        this.load.spritesheet('Bird_BL',
			'../resources/Pajaritos_black.png',
			{ frameWidth: 123, frameHeight: 96 }
		);
    }
    create(){

         //Bird animations
         this.anims.create({
            key: 'Bird_WH_right',
            frames: this.anims.generateFrameNumbers('Bird_WH', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1 
          });
        this.anims.create({
            key: 'Bird_WH_left',
            frames: this.anims.generateFrameNumbers('Bird_WH', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1 
          });
        this.anims.create({
            key: 'Bird_BL_right',
            frames: this.anims.generateFrameNumbers('Bird_BL', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1 
          });
        this.anims.create({
            key: 'Bird_BL_left',
            frames: this.anims.generateFrameNumbers('Bird_BL', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1 
          });
        this.anims.create({
            key: 'Bird_BR_right',
            frames: this.anims.generateFrameNumbers('Bird_BR', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1 
          });
        this.anims.create({
            key: 'Bird_BR_left',
            frames: this.anims.generateFrameNumbers('Bird_BR', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1 
        });

        //Sky
        this.sky = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'sky');
        this.sky.setOrigin(0, 0);
        this.sky.setScale(1);

        //Player
        this.player = this.physics.add.sprite(config.width / 2, config.height * 0.9, 'rocket');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.22);

        //Enemy
        this.enemies = this.physics.add.group();
        this.createEnemy();
        this.physics.add.collider(this.player, this.enemies, (body1, body2) => this.hitEnemy(body1, body2));

        //this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });
    }
    update(){
        if (!(this.gameOver || this.gamePaused)) {
		    // Moviment
            if(this.cursors.esc.isDown){
                this.gamePaused = true;
            }
            
            if (this.cursors.left.isDown){
                this.player.setVelocityX(-160);
                //this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown){
                this.player.setVelocityX(160);
                //this.player.anims.play('right', true);
            }
            else {
                this.player.setVelocityX(0);
                //this.player.anims.play('turn');
            }

            /*if (this.cursors.up.isDown && this.player.body.touching.down){
                this.player.setVelocityY(-330);
            }*/
                
            
            //Velocitat del cel
            if (this.skySpeed <= 1) {
                this.skySpeed *= 1.01;
            }   
            this.sky.tilePositionY -= this.skySpeed; 
            

            //Enemics
           
			
        }
    }
    createEnemy() {
        var enemy = this.enemies.create(0 , 0 , 'Bird_WH')
        enemy.anims.play('bird_right_WH');
        enemy.setVelocity(ENEMY_VEL, (Phaser.Math.Between(0, 1) === 0 ? -1 : 1) * ENEMY_VEL)

        enemy.setScale(.25)


    }

    hitEnemy(player, enemy) {
        this.physics.pause();
        setTimeout(() => loadpage("../"), 3000);
        this.gameOver = true
    }
}