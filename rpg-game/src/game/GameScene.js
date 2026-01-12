import { Application, Container, Texture, Sprite, Point } from 'pixi.js'
import assetsToLoad from "./assetsToLoad";
import Character from "../game/Character"
export default class GameScene {
  character;
  characterContainer;
  mapContainer;
  map;
  constructor(app, loader) {
    this.app = app
    this.loader = loader
    this.playerSheet = {}
    this.press = false;
    this.touchDown = false;
    this.screenCenterX = app.screen.width * 0.5;
    this.screenCenterY = app.screen.height * 0.5;
    let that = this;
    let timeStart, time, timeEnd, newMapPosX, newMapPosY;
    this.initMap()
    this.initCharacter()
    this.targetX = this.character.x;
    this.targetY = this.character.y;
    this.speed = 5;
    this.radian = null
    this.pos = { x: 0, y: 0 }
    function getTimeNow() {
      var now = new Date();
      return now.getTime();
    }

    this.map.on("pointerdown", function (evt) {
      if (that.press || that.touchDown) return
      this.touchDown = true
      let { x, y } = evt.data.global;
      that.pos = { x, y };
      console.log(x, y)
      timeStart = getTimeNow();

      //setInterval会每100毫秒执行一次，也就是每100毫秒获取一次时间

      time = setInterval(function () {
        timeEnd = getTimeNow();

        //如果此时检测到的时间与第一次获取的时间差有1000毫秒
        if (timeEnd - timeStart > 300) {
          clearInterval(time);
          that.press = true;

          getRadian(x - that.mapContainer.x, y - that.mapContainer.y);
          moveControls(that.radian)
        }
      }, 100);
    });
    this.map.on("pointermove", function (evt) {
      if (that.press) {
        let { x, y } = evt.data.global;
        that.pos = { x, y };
        getRadian(x - that.mapContainer.x, y - that.mapContainer.y);
        moveControls(that.radian)
      }
    });
    this.map.on("pointerup", function (evt) {

      clearInterval(time);
      that.touchDown = false;
      that.press = false;
      let { x, y } = evt.data.global;
      that.pos = { x, y };
      goto(
        that.character.x + (x - (that.character.x + that.mapContainer.x)),
        that.character.y + (y - (that.character.y + that.mapContainer.y))
      );

    });
    app.ticker.add(function (delta) {
      if (that.press) {
        const cosVal = Math.cos(that.radian);
        const sinVal = Math.sin(that.radian);
        newMapPosX = that.mapContainer.x - that.speed * cosVal;
        newMapPosY = that.mapContainer.y - that.speed * sinVal;
        const mapBounds = {
          minX: app.screen.width - that.map.width,
          maxX: 0,
          minY: app.screen.height - that.map.height,
          maxY: 0,
        }

        newMapPosX = Math.max(mapBounds.minX, Math.min(newMapPosX, mapBounds.maxX));
        newMapPosY = Math.max(mapBounds.minY, Math.min(newMapPosY, mapBounds.maxY));
        that.characterContainer.x = newMapPosX;
        that.characterContainer.y = newMapPosY;
        that.mapContainer.x = newMapPosX;
        that.mapContainer.y = newMapPosY;

        let newPosX = that.character.x + that.speed * cosVal;
        let newPoxY = that.character.y + that.speed * sinVal;
        let realPosX = (that.character.x + (that.pos.x - (that.character.x + that.mapContainer.x)))
        let realPosY = (that.character.y + (that.pos.y - (that.character.y + that.mapContainer.y)))
        if (newPosX < 0) {
          newPosX = 0;
        }
        if (newMapPosX === 0 && newPosX <= realPosX) {
          newPosX = realPosX
        }
        if (newPosX > that.map.width) {
          newPosX = that.map.width;
        }
        if (newMapPosX === app.screen.width - that.map.width && newPosX >= realPosX) {
          // console.log(newMapPosX,that.map.width)
          newPosX = realPosX
        }
        if (newPoxY < 0) {
          newPoxY = 0;
        }
        if (newMapPosY === 0 && newPoxY <= realPosY) {
          newPoxY = realPosY
        }
        if (newPoxY > that.map.height) {
          newPoxY = that.map.height;
        }
        if (newMapPosY === app.screen.height - that.map.height && newPoxY >= realPosY) {
          newPoxY = realPosY
        }
        that.character.x = newPosX;
        that.character.y = newPoxY;
      } else {
        gameLoop(delta);
      }

    });
    function gameLoop() {
      walk();
    }
    function getRadian(x, y) {
      that.radian = Math.atan2(y - that.character.y, x - that.character.x);
    }
    function goto(x, y) {
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (x > that.map.width) {
        x = that.map.width;
      }
      if (y > that.map.height) {
        y = that.map.height;
      }
      that.targetX = x;
      that.targetY = y;
      that.radian = Math.atan2(y - that.character.y, x - that.character.x);
      that.rotation = that.radian;
    }
    function walk() {
      if (that.targetX === that.character.x && that.targetY === that.character.y) {
        that.character.switchAnimation('stand')
        return;
      }
      const dx = that.character.x - that.targetX;
      const dy = that.character.y - that.targetY;
      const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      if (distance <= that.speed) {
        // 距离小于一帧直接赋值
        that.character.x = that.targetX;
        that.character.y = that.targetY;
        that.character.switchAnimation('stand')
      } else {
        that.character.x = that.character.x + that.speed * Math.cos(that.radian);
        that.character.y = that.character.y + that.speed * Math.sin(that.radian);
        moveControls(that.radian)
      }
    }
    function contain(sprite, container) {
      let collision = undefined;

      if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
      }
      if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
      }
      if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
      }
      if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
      }

      return collision;
    }
    function moveControls(radian) {
      let angle = (radian * 180 / Math.PI)
      if (angle >= 30 && angle <= 150) {
        that.character.switchAnimation('front')
      }
      if (angle < 30 && angle > -30) {
        that.character.switchAnimation('right')
      }
      if (angle <= -30 && angle > -150) {
        that.character.switchAnimation('back')
      }
      if (angle > 150 && angle <= 180 || angle <= -150) {
        that.character.switchAnimation('left')
      }
    }
  }
  initCharacter() {
    let characterData = assetsToLoad.find((item) => {
      return item.type === 'character'
    })
    let resources = this.loader.resources
    characterData.assets.forEach((item) => {
      const resource = resources[item.name]
      const splittedName = resource.name.split('_')
      const direction = splittedName[1]
      this.playerSheet[direction] = resource.spritesheet.animations[resource.name]
      this.playerSheet[`${direction}_stand`] = [resource.spritesheet.textures[`${resource.name}_1.png`]]
    })
    this.character = new Character({
      game: this.app,
      spritesheet: this.playerSheet,
    });
    this.characterContainer = new Container();
    this.app.stage.addChild(this.characterContainer);
    this.character.scale.set(2)
    this.character.anchor.set(0.5, 0.5);
    this.character.x = this.screenCenterX;
    this.character.y = this.screenCenterY;
    this.character.animationSpeed = 0.075
    this.character.play()
    this.characterContainer.addChild(this.character);
  }
  initMap() {
    let resources = this.loader.resources
    this.mapContainer = new Container();
    this.app.stage.addChild(this.mapContainer);
    this.map = new Sprite(resources["map"].texture);
    this.mapContainer.addChild(this.map);
    this.map.interactive = true;
  }
}