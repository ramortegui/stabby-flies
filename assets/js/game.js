import Player from "./player";
import {setupCanvas} from './utils/'

export class Game {
  constructor() {
    this.display = undefined;
    this.engine = undefined;

    this.state = {
      camera: {
        x: 5,
        y: 5
      },
    };

    this.players = [];
  }

  setup(obj) {
    console.log("setup");
    this.app = new PIXI.Application({width: 600, height: 300});
    setupCanvas(this.app)
    this.app.renderer.backgroundColor = 0x91bee2;

    PIXI.loader
    .add('/spritesheet.json')
    .load(this.loaded.bind(this));
  }

  loaded () {
    console.log('LOADED :Ds ')

    const floor = new PIXI.extras
    .TilingSprite(PIXI.Texture.fromImage('earthen_floor.png'), 5000, 100);
    floor.y = 200
    
    this.app.stage.addChild(floor);

    requestAnimationFrame(this.animate.bind(this));
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
  }

  addPlayer(player) {
    this.players.push(player);
    this.drawPlayer(player);
  }

  drawPlayer(player) {}
}
