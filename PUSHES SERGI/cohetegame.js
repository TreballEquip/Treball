"use strict";

const ENEMY_VEL = 200
const BG_MAX_VEL = 1
const BG_ACCELERATION = 1.01
const PLAYER_VEL = 160
const BULLET_VEL = 300
const MAX_AMMO = 10


class CoheteScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.platforms = null;
		this.player = null;
        this.ammo = null;
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

        //spritesheet pajaros
        this.load.spritesheet('Bird_BR',
			'../resources/Pajaritos_brown.png',
			{ frameWidth: 123, frameHeight: 96 }
		);

        this.load.spritesheet('Bird_WH',
			'../resources/Pajaritos_white.png',
			{ frameWidth: 123, frameHeight: 96 }
		);

        this.load.spritesheet('Bird_BL',
			'../resources/Pajaritos_black.png',
			{ frameWidth: 123, frameHeight: 96 }
		);
        //spritesheet misil
        this.load.spritesheet('misil',
			'../resources/missil.png',
			{ frameWidth: 71, frameHeight: 19 }
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
        //misil animacio
        this.anims.create({
            key: 'misilAnim',
            frames: this.anims.generateFrameNumbers('misil', { start: 0, end: 5 }),
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
        this.physics.add.collider(this.enemies, this.player, (body1, body2) => this.collisionEnemyPlayer(body1, body2));

        //Bales
        this.ammo = this.physics.add.group();
        this.physics.add.collider(this.ammo, this.enemies, (body1, body2) => this.collisionAmmoEnemy(body1, body2));

        //this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
        });

        this.input.on('pointerdown', this.createBullet, this)
    }
    update(){
        if (!(this.gameOver || this.gamePaused)) {
		    // Moviment
            if (this.cursors.esc.isDown){
                this.gamePaused = true;
            }
            
            if (this.cursors.left.isDown){
                this.player.setVelocityX(-PLAYER_VEL);
                //this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown){
                this.player.setVelocityX(PLAYER_VEL);
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


            //Bales
            //console.log("player pos: " + this.player.x + " " + this.player.y)
        }
    }
    createEnemy() {

        
        //basat en l'altura podem fer pajaros o avions
        //si altura < de noseque
        const birds = ['Bird_WH', 'Bird_BR', 'Bird_BL'];
        const randomBird = birds[Phaser.Math.Between(0, birds.length - 1)];
        
        var posInicialX = -100
        var direccio = 1
        var dirAEsq = Phaser.Math.Between(0, 1)
        var string_dir = "_right"

        if (dirAEsq) {
            posInicialX = config.width + 100
            direccio = -1
            string_dir = "_left"
        }

        var enemy = this.enemies.create(posInicialX, -100, randomBird)
        enemy.anims.play(randomBird+string_dir);
        enemy.setScale(.5)
        var velInicialX = Phaser.Math.Between(50, 200)

        enemy.setVelocity(velInicialX * direccio, ENEMY_VEL)

        console.log(velInicialX * direccio)
    }

    createBullet(pointer) {
        var velOffsetX = pointer.x - this.player.x
        var velOffsetY = pointer.y - this.player.y

        var modulVel = Math.sqrt(velOffsetX * velOffsetX + velOffsetY * velOffsetY)

        var bala = this.ammo.create(this.player.x, this.player.y - 65, 'misil')
        bala.anims.play('misilAnim');
        bala.setVelocity(velOffsetX * BULLET_VEL / modulVel, velOffsetY * BULLET_VEL / modulVel)
        bala.setScale(.25)
    }

    collisionEnemyPlayer(enemy, player) {
        this.physics.pause();
        setTimeout(() => loadpage("../"), 3000);
        this.gameOver = true
    }
    collisionAmmoEnemy(ammo, enemy) {
        console.log("TOCADO Y HUNDIDO PUTA")
        ammo.destroy()
        enemy.destroy()
    }
}