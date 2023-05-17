"use strict";

class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.platforms = null;
		this.player = null;
		this.cursors = null;
		this.stars = null;
		this.score = 0;
		this.scoreText;
		this.bombs = null;
		this.gameOver = false;
        this.sky = null;
        this.skySpeed = 0.01;
    }
    preload (){	
        this.load.image('rocket', '../resources/rocket.png');
        this.load.image('sky','../resources/sky.png');
    }

    create(){
        //Sky
        this.sky = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'sky');
        this.sky.setOrigin(0, 0);
        this.sky.setScale(1);

        //Player
        this.player = this.physics.add.sprite(100, 500, 'rocket');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.22);
        

        this.cursors = this.input.keyboard.createCursorKeys();

    }
    update(){
        if (this.gameOver) return;
		{ // Moviment
			if (this.cursors.left.isDown){
				this.player.setVelocityX(-160);
				//this.player.anims.play('left', true);
			}
			else if (this.cursors.right.isDown){
				this.player.setVelocityX(160);
				//this.player.anims.play('right', true);
			}
			else{
				this.player.setVelocityX(0);
				//this.player.anims.play('turn');
			}

			if (this.cursors.up.isDown && this.player.body.touching.down){
                this.player.setVelocityY(-330);
            }
				
            
            //Velocitat del cel
            skySpeed *= 1.5;
            this.sky.tilePositionY -= skySpeed; 
        }
    }
}