export default class Player {
  constructor({x=0,y=0}) {
    this.x = x
    this.y = y

  }
  draw () {
      Game.display.draw(this._x, this._y, "@", "#ff0");
  }
 
}