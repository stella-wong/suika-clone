import './style.css'
import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  preload () {
    this.load.image('peppermint', '/assets/peppermint.png');
    this.load.image('boxBG', '/assets/box-bg.png');
  }

  create () {
    const boxBG = this.add.image(400, 300, 'boxBG').setScale(0.5).setInteractive();

    const wallThickness = 22;

    // left wall
    this.matter.add.rectangle(
      boxBG.getBounds().left - wallThickness / 2,
      300,
      wallThickness,
      600,
      { isStatic: true }
    );

    // right wall
    this.matter.add.rectangle(
      boxBG.getBounds().right + wallThickness / 2,
      300,
      wallThickness,
      600,
      { isStatic: true }
    );

    // floor
    this.matter.add.rectangle(
      400,
      boxBG.getBounds().bottom + wallThickness / 2,
      800,
      wallThickness,
      { isStatic: true }
    );

    boxBG.on('pointerdown', (pointer) => {
      const peppermint = this.matter.add.image(pointer.x, pointer.y, 'peppermint');
      peppermint.setScale(0.5);
    });
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#84d0b0',
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
      debug: true,
    },
  },
  scene: GameScene,
};

const game = new Phaser.Game(config);