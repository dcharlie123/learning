import * as PIXI from 'pixi.js'

class Character extends PIXI.AnimatedSprite {
  constructor({ game, spritesheet, spritesheetDirection = 'front_stand' }) {
    super(spritesheet[spritesheetDirection])
    this.game = game
    this.characterAnimations = {
      spritesheet,
      spritesheetDirection,
    }
  }
  switchAnimation(sheetDirection){
    const spritesheetDirection = this.characterAnimations.spritesheetDirection
    let direction = sheetDirection

    if (sheetDirection === 'stand') {
      direction = `${spritesheetDirection}_stand`
    }

    if (this.characterAnimations.spritesheet[direction] && spritesheetDirection !== direction) {
      this.characterAnimations.spritesheetDirection = direction

      this.textures = this.characterAnimations.spritesheet[direction]
      this.play()
    }
  } 
  initEvent(){
    
  }
}
export default Character