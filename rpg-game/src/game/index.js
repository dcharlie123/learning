import {Application} from 'pixi.js'
import LoadingScene from './loadingScene'
import GameScene from './GameScene'
class Game {
  app;
  constructor(){

  }
  init(){
    this.app = new Application({
      width: document.body.offsetWidth * 2,
      height: document.body.offsetHeight * 2,
      backgroundColor: 12034423,
      antialiasing: true,
      transparent: false,
      resolution: 1,
    });
    document.querySelector(".canvas-container").appendChild(this.app.view);
    this.startLoading()
  }
  startLoading(){
    new LoadingScene(this.app,this.startGame.bind(this))
  }
  startGame(loader){
    new GameScene(this.app,loader)
  }
}

export default Game