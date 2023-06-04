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
        this.ammoPhoto = null;
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
        this.boxAmmo = null;
        this.showLand = true;
        this.nAmmo = 2;
        this.shield = null;
        this.fuelBarrel = null;
        this.fuelDownBarrel = null;
    }
    preload (){	
        this.load.image('sky','../resources/background/sky.png');
        this.load.image('enemy','../resources/MIERDA.png');
        this.load.image('land','../resources/background/land.png');
        this.load.image('m1','../resources/background/m1.png');
        this.load.image('m2','../resources/background/m2.png');
        this.load.image('m3','../resources/background/m3.png');
        this.load.image('ammo_logo','../resources/municio.png');
        this.load.image('boxAmmo','../resources/ammoBox.png');
        this.load.image('shield','../resources/shield.png');
        this.load.image('fuelBarrel','../resources/fuelBarrel.png');
        this.load.image('fuelDownBarrel','../resources/fuelDownBarrel.png');

        //spritesheet rocket
        this.load.spritesheet('rocket',
			'../resources/cohete/rocket.png',
			{ frameWidth: 320, frameHeight: 672 }
		);

        this.load.spritesheet('rocketShield',
            '../resources/cohete/rocketShield.png',
            { frameWidth: 320, frameHeight: 672 }
        );

        //spritesheet pajaros
        this.load.spritesheet('Bird_BR',
			'../resources/enemigos/Pajaritos_brown.png',
			{ frameWidth: 123, frameHeight: 96 }
		);

        this.load.spritesheet('Bird_WH',
			'../resources/enemigos/Pajaritos_white.png',
			{ frameWidth: 123, frameHeight: 96 }
		);

        this.load.spritesheet('Bird_BL',
			'../resources/enemigos/Pajaritos_black.png',
			{ frameWidth: 123, frameHeight: 96 }
		);
         //spritesheet misil
         this.load.spritesheet('misil',
         '../resources/cohete/missil.png',
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

        //Mountains
        this.m3 = this.physics.add.sprite(0, 0, 'm3');
        this.m3.setOrigin(0.05,-0.35);
        this.m3.setScale(1.2);

        this.m2 = this.physics.add.sprite(0, 0, 'm2');
        this.m2.setOrigin(0.05,-0.35);
        this.m2.setScale(1.2);

        this.m1 = this.physics.add.sprite(0, 0, 'm1');
        this.m1.setOrigin(0.05,-0.35);
        this.m1.setScale(1.2);

        //Land
        this.land = this.physics.add.sprite(0, 0, 'land');
        this.land.setOrigin(0.05,-0.35);
        this.land.setScale(1.2);

        //Player
        this.player = this.physics.add.sprite(config.width / 2, config.height * 0.9, 'rocket');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.22);

        //player anim
        this.player.anims.create({
            key: 'rocketAnim',
			frames: this.anims.generateFrameNumbers('rocket', { start: 0, end: 8 }),
			frameRate: 10,
			repeat: -1
        });
        this.player.anims.create({
            key: 'rocketAnim2',
			frames: this.anims.generateFrameNumbers('rocketShield', { start: 0, end: 8 }),
			frameRate: 10,
			repeat: -1
        });
        this.player.anims.play('rocketAnim', true);

        //Enemy
        this.enemies = this.physics.add.group();
        this.createEnemy();
        this.physics.add.collider(this.enemies, this.player, (body1, body2) => this.collisionEnemyPlayer(body1, body2));

        //Bales
        this.ammo = this.physics.add.group();
        this.physics.add.collider(this.ammo, this.enemies, (body1, body2) => this.collisionAmmoEnemy(body1, body2));
        this.input.on('pointerdown', this.createBullet, this);

        //BoxAmmo
        this.boxAmmo = this.physics.add.group();
        this.physics.add.overlap(this.boxAmmo, this.player, (body1, body2) => this.collisionBoxAmmoPlayer(body1, body2));


        //Shield
        this.shield = this.physics.add.group();
        this.physics.add.overlap(this.shield, this.player, (body1, body2) => this.collisionShieldPlayer(body1, body2));


        //FuelBarrel
        this.fuelBarrel = this.physics.add.group();
        this.physics.add.overlap(this.fuelBarrel, this.player, (body1, body2) => this.collisionFuelPlayer(body1, body2));
        
        //FuelDOwnBarrel
        this.fuelDownBarrel = this.physics.add.group();
        this.physics.add.overlap(this.fuelDownBarrel, this.player, (body1, body2) => this.collisionFuelDownPlayer(body1, body2));
      
        //UI
        this.scoreText = this.add.text(80, config.height - 62, this.nAmmo, { fontSize: "32px", fill: '#000' });
        this.ammoPhoto = this.add.image(50, config.height - 48, 'ammo_logo')
        this.ammoPhoto.setScale(.1)

        //Moviment
        this.cursors = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
        });

        //Llançar power ups
        this.managePowerUps();
        setTimeout(() => {
            this.managePowerDowns();
        }, 2000);

        //Quan pasin 15 segons elimina el terra
        setTimeout(() => {
            this.showLand = false;
            this.m1.destroy();
            this.m2.destroy();
            this.m3.destroy();
            this.land.destroy();
        }, 15000);
    }
    update(){
        if (!(this.gameOver || this.gamePaused)) {
		    // Moviment
            if (this.cursors.esc.isDown){
                this.gamePaused = true;
            }
            
            if (this.cursors.left.isDown || this.cursors.a.isDown){
                this.player.setVelocityX(-PLAYER_VEL);

                if (this.player.rotation >= Math.PI / -4) this.player.rotation -= Math.PI / 64
            }
            else if (this.cursors.right.isDown || this.cursors.d.isDown){
                this.player.setVelocityX(PLAYER_VEL);
                
                if (this.player.rotation <= Math.PI / 4) this.player.rotation += Math.PI / 64
            }
            else {
                this.player.setVelocityX(0);
                if (this.player.rotation > 0.1) this.player.rotation -= Math.PI / 64
                else if (this.player.rotation < -0.1) this.player.rotation += Math.PI / 64
                else this.player.rotation = 0
            }
            
            //Velocitat del cel
            if (this.skySpeed <= 3) {
                this.skySpeed *= 1.01;
            }else if(this.skySpeed <= 10){
                this.skySpeed *= 1.0005;
            }
            this.sky.tilePositionY -= this.skySpeed; 
            if(this.showLand){
                this.land.setVelocityY(this.skySpeed*75);
                this.m1.setVelocityY(this.skySpeed*70);
                this.m2.setVelocityY(this.skySpeed*65);
                this.m3.setVelocityY(this.skySpeed*55);
            }
            
            //hem de afegir que s'eliminin quan ja no es veuen 


            
        }
    }
    createEnemy() {
        //basat en l'altura podem fer pajaros o avions
        //si altura < de noseque
        const birds = ['Bird_WH', 'Bird_BR', 'Bird_BL'];
        const randomBird = birds[Phaser.Math.Between(0, birds.length - 1)];
        
        var posInicialX = -100;
        var direccio = 1;
        var dirAEsq = Phaser.Math.Between(0, 1);
        var string_dir = "_right";

        if (dirAEsq) {
            posInicialX = config.width + 100;
            direccio = -1;
            string_dir = "_left";
        }

        var enemy = this.enemies.create(posInicialX, -100, randomBird);
        enemy.anims.play(randomBird+string_dir);
        enemy.setScale(.5);
        var velInicialX = Phaser.Math.Between(50, 200);

        enemy.setVelocity(velInicialX * direccio, ENEMY_VEL)
    }

    createBullet(pointer) {
        if(this.nAmmo >0){
            this.nAmmo--;
            this.scoreText.setText(this.nAmmo);
            var velOffsetX = pointer.x - this.player.x;
            var velOffsetY = pointer.y - this.player.y;

            var modulVel = Math.sqrt(velOffsetX * velOffsetX + velOffsetY * velOffsetY);

            var velX = velOffsetX / modulVel
            var velY = velOffsetY / modulVel

            var bala = this.ammo.create(this.player.x + (this.player.rotation * 100), (this.player.y - 100) + (Math.abs(this.player.rotation) * 50), 'misil');
            bala.anims.play('misilAnim');
            bala.setVelocity(velX * BULLET_VEL, velY * BULLET_VEL);
            bala.setScale(.7);
        // bala.rotation = -(Math.PI / 2);
            bala.rotation = -Math.atan(velOffsetX/velOffsetY) - Math.PI / 2;
        }
    }
    managePowerUps(){
        var randomPowerUp = Phaser.Math.Between(1, 4);
        if(randomPowerUp == 1){
            this.createBoxAmmo();
        }else if(randomPowerUp == 2 || randomPowerUp == 4){
            this.createFuel();
        }else if(randomPowerUp == 3){
            this.createShield();
        }else if(randomPowerUp == 5){
            this.createFuelDown();
        }
        setTimeout(() => {
            this.managePowerUps();
        }, 16000);

    }

    managePowerDowns(){
        var randomTime = Phaser.Math.Between(1, 15);
        this.createFuelDown();
        setTimeout(() => {
            this.managePowerDowns();
        }, randomTime*1000);
    }

    createBoxAmmo(){
        // x[50, 850] y=-1000
        //velY = [50,300]
        console.log("Drop");
        var bX = Phaser.Math.Between(50, 850);
        var bY = -1000;
        var caixa = this.boxAmmo.create(bX,bY,'boxAmmo');
        caixa.setScale(0.2);
        var velY = 300;
        caixa.setVelocityY(velY);
        setTimeout(() => {
            caixa.destroy();
        }, 15000);
    }

    createShield(){
        // x[50, 850] y=-1000
        //velY = [50,300]
        console.log("Drop");
        var bX = Phaser.Math.Between(50, 850);
        var bY = -1000;
        var escut = this.shield.create(bX,bY,'shield');
        escut.setScale(0.15);
        var velY = 300;
        escut.setVelocityY(velY);
        setTimeout(() => {
            escut.destroy();
        }, 15000);
    }

    createFuel(){
        // x[50, 850] y=-1000
        //velY = [50,300]
        console.log("Drop");
        var bX = Phaser.Math.Between(50, 850);
        var bY = -1000;
        var combustible = this.fuelBarrel.create(bX,bY,'fuelBarrel');
        combustible.setScale(0.15);
        var velY = 300;
        combustible.setVelocityY(velY);
        setTimeout(() => {
            combustible.destroy();
        }, 15000);
    }

    createFuelDown(){
        console.log("Drop");
        var bX = Phaser.Math.Between(50, 850);
        var bY = -1000;
        var downCombustible = this.fuelDownBarrel.create(bX,bY,'fuelDownBarrel');
        downCombustible.setScale(0.15);
        var velY = 300;
        downCombustible.setVelocityY(velY);
        setTimeout(() => {
            downCombustible.destroy();
        }, 15000);
    }

    collisionEnemyPlayer(enemy, player) {
        this.physics.pause();
        setTimeout(() => loadpage("../"), 3000);
        this.gameOver = true;
    }
    collisionAmmoEnemy(ammo, enemy) {
        console.log("TOCADO Y HUNDIDO PUTA");
        ammo.destroy();
        enemy.destroy();
    }
    collisionBoxAmmoPlayer(player,boxAmmo){
        boxAmmo.destroy();
        this.nAmmo++;
        this.scoreText.setText(this.nAmmo);
    }
    collisionShieldPlayer(player, shield){
        shield.destroy();
        this.player.anims.play('rocketAnim2', true);
        setTimeout(() => {
            this.player.anims.play('rocketAnim', true);
        }, 15000);
    }

    collisionFuelPlayer(player,fuelBarrel){
        fuelBarrel.destroy();
        //Falta completar per incrementar combustible
    }

    collisionFuelDownPlayer(player,fuelDownBarrel){
        fuelDownBarrel.destroy();
        //Falta completar per aumentar el consum durant x segons
    }
}