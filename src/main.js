import './style.css'
import Phaser from 'phaser';

// game object options
const objectOptions = [
  'gumdrop',
  'bell',
  'gingerbread',
  'ornament',
  'penguin',
];

// return random game object
function getRandomObject() {
  return objectOptions[Math.floor(Math.random() * objectOptions.length)];
}

class GameScene extends Phaser.Scene {
  preload () {
    this.load.image('gumdrop', '/assets/gumdrop.png');
    this.load.image('bell', '/assets/bell.png');
    this.load.image('gingerbread', '/assets/gingerbread.png');
    this.load.image('ornament', '/assets/ornament.png');
    this.load.image('penguin', '/assets/penguin.png');
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

    // initial current object, show at top of box
    let currObject = getRandomObject();
    const currPreview = this.add.image(boxBG.getBounds().right / 2, 0, currObject);
    currPreview.setScale(0.5);
    // initial next object, show at top right
    let nextObject = getRandomObject();
    const nextPreview = this.add.image(boxBG.getBounds().right, 0, nextObject);
    nextPreview.setScale(0.5);

    // spawn current object on click
    boxBG.on('pointerdown', (pointer) => {
      const object = this.matter.add.image(pointer.x, 0, currObject);
      object.setCircle();
      object.setScale(0.5);
      object.setData('type', currObject);

      // replace current with next preview
      currObject = nextObject;
      currPreview.setTexture(currObject);
      // new next object preview
      nextObject = getRandomObject();
      nextPreview.setTexture(nextObject);
    });

    const mergePattern = {
      'gumdrop': 'bell',
      'bell': 'gingerbread',
      'gingerbread': 'ornament',
      'ornament': 'penguin',
    };

    // detect collision and merge
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const objectA = pair.bodyA.gameObject;
        const objectB = pair.bodyB.gameObject;
        if (!objectA || !objectB) return;

        const typeA = objectA.getData('type');
        const typeB = objectB.getData('type');

        if (typeA == typeB) {
          const mergeResult = mergePattern[typeA];
          const x = (objectA.x + objectB.x) / 2;
          const y = (objectA.y + objectB.y) / 2;

          objectA.destroy();
          objectB.destroy();

          if (!mergeResult) return;

          const mergedObject = this.matter.add.image(x, y, mergeResult);
          mergedObject.setCircle();
          mergedObject.setScale(0.5);
          mergedObject.setData('type', mergeResult);
        }
      });
    })
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