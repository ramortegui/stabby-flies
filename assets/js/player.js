export default class Player extends PIXI.Container {
  constructor(props) {
    super(props)
    console.log(props.x)
    console.log(props.y)

    this.x = props.x;
    this.y = props.y;
  }
}
