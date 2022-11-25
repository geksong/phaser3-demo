import Phaser from "phaser";
import BunnyHopScene from './scenes/BunnyHopScene';

const gameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300}
        }
    },
    scene: [BunnyHopScene]
};

export default new Phaser.Game(gameConfig);