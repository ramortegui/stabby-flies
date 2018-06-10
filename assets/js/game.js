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
    const app = new PIXI.Application({width: 512, height: 256});
    setupCanvas(app)
    app.renderer.backgroundColor = 0x91bee2;

    PIXI.loader
    .add('/spritesheet.json')
    .load(this.loaded);
  }

  loaded = () => {
    console.log('LOADED :D ')
  }

  addPlayer(player) {
    this.players.push(player);
    this.drawPlayer(player);
  }

  drawPlayer(player) {}
}
