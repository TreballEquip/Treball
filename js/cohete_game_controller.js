var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    parent: 'game_area',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 0},
			debug: false
		}
	},
    scene: [ CoheteScene ]
};

var game = new Phaser.Game(config);