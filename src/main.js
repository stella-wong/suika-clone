import './style.css'
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#84d0b0',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
    },
  },
};

const game = new Phaser.Game(config);