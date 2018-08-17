export default class Fly extends PIXI.Container {
  constructor() {
    super();

    // let alienImages = ["clg.png","image_sequence_02.png","image_sequence_03.png","image_sequence_04.png"];
    let textureArray = [];
    for (let i = 1; i < 4; i++) {
      let texture = PIXI.Texture.fromImage("fly_" + i +".png");
      textureArray.push(texture);
    }
    let mc = new PIXI.extras.AnimatedSprite(textureArray);
    mc.play()
    mc.animationSpeed = .1
    this.addChild(mc)
  }
}
