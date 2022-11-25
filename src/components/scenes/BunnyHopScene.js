import Phaser from "phaser";

export default class BunnyHopScene extends Phaser.Scene {
    constructor() {
        super('bunnyhop');
    }

    platforms;
    player;
    cursors;
    stars;
    bombs;
    gameOver = false;

    gameWidth = 800;
    gameHeight = 600;

    playScore = 0;
    playScoreText;

    preload() {
        this.load.image('sky', "/bunnyhop/sky.png");
        this.load.image('ground', "/bunnyhop/platform.png");
        this.load.image('ground2', "/bunnyhop/platformBase2.png");
        this.load.image('pushBlock1', "/bunnyhop/pushBlock1.png");
        this.load.image('star', "/bunnyhop/star.png");
        this.load.image('bomb', "/bunnyhop/bomb.png");
        this.load.spritesheet('dude',"/bunnyhop/dude.png", {frameWidth: 32, frameHeight: 48});
    }

    create() {
        this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'sky');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(this.gameWidth / 2, this.gameHeight - 16, 'ground').setScale(2).refreshBody();

        this.platforms.create(this.gameWidth / 2 + 200, 400, 'ground2');
        this.platforms.create(this.gameWidth / 2 - 350, 250, 'ground2');
        this.platforms.create(this.gameWidth / 2 + 350, 220, 'ground2');

        //player
        this.player = this.physics.add.sprite(this.gameWidth / 2 - 100, 500, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start:0, end:3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key:'dude', frame:4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        //stars
        this.stars = this.physics.add.group({
            key:'star',
            repeat: 11,
            setXY: {x: this.gameWidth / 2 - 380, y: 0, stepX: 70}
        });

        this.stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(this.stars, this.platforms);

        //player collider star
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        //scoreText
        this.playScoreText = this.add.text(this.gameWidth / 2 - 384, 16, 'Score: ' + this.playScore, {fontSize: '32px', fill: '#000'});

        //bombs
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    update() {
        if(this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }else if(this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        if(this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-430);
        }
    }

    collectStar(inPlayer, inStar) {
        inStar.disableBody(true, true);

        this.playScore += 10;
        this.playScoreText.setText('Score: ' + this.playScore);

        if(this.stars.countActive(true) === 0) {
            this.stars.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (this.player.x < (this.gameWidth / 2) ? 
                Phaser.Math.Between(this.gameWidth / 2, this.gameWidth / 2 + 400) : Phaser.Math.Between(this.gameWidth / 2 - 400, this.gameWidth / 2));
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    hitBomb(inPlayer, inBomb) {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.gameOver = true;
    }
}