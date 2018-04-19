export class Game {
  constructor() {
    this.display = undefined

    this.state = {
      camera: {
        x: 5,
        y: 5,
      },
      map: {}
    }
  }

  setup(obj) {
    console.log('setup')
    const { map } = obj
    this.state.map = map

    this.display = new ROT.Display();
    const k = document.getElementById('game-container-grid')
    k.appendChild(this.display.getContainer());

    this.drawWholeMap()

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