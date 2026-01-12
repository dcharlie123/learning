import assetsToLoad from "./assetsToLoad";
import {Loader} from "pixi.js";
class LoadingScene{
  constructor(app,callback){
    this.app=app;
    this.callback=callback;
    let loader = new Loader();
    assetsToLoad.forEach((item) => {
      item.assets.forEach((assetsItem) => {
        loader.add(assetsItem.name, assetsItem.path);
      });
    });
    console.log(loader)
    loader.onComplete.add(this.handleLoadComplete.bind(this));
    loader.onProgress.add(this.handleLoadProgress.bind(this))
    loader.load()
  }
  handleLoadProgress(e){
    console.log(e.progress)
  }
  handleLoadComplete(loader){
    this.callback(loader)
  }
}
export default LoadingScene