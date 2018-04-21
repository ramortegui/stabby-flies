import Player from './player'
export class Game {
  constructor() {
    this.display = undefined
    this.engine = undefined

    this.state = {
      camera: {
        x: 5,
        y: 5,
      },
      map: {}
    }

    this.players = []
  }

  setup(obj) {
    console.log('setup')
    const { map } = obj
    this.state.map = map

    this.display = new ROT.Display();
    
    const scheduler = new ROT.Scheduler.Simple();

    this.engine = new ROT.Engine(scheduler);
    this.engine.start();

    const k = document.getElementById('game-container-grid')
    if (k.children.length === 0) {
      k.appendChild(this.display.getContainer());
    }

    this.drawWholeMap()

  }

  addPlayer(player) {
    this.players.push(player)
    this.drawPlayer(player)
  }

  drawPlayer (player) {
    this.display.draw(player.x, player.y, "@", "#ff0");
  }


  drawWholeMap() {
    console.log('draw whole map')
    this.state.map.forEach((y, yIndex) => {
      y.forEach((x, xIndex) => {
        this.display.draw(xIndex, yIndex, x);
      })
    })

    

  }

  createNode(character) {
    var div = document.createElement("div");
    div.innerHTML = character;

    switch(character) {
      case '~': 
        div.setAttribute('class', 'tilda-char');
        break;
      default: 
        div.setAttribute('class', 'error-char');
        break
    }
    document.getElementById('game-container-grid').appendChild(div)

  }

  
}