<template>
  <div class="map">
    <transition name="el-fade-in-linear">
      <div
        id="joystick-zone"
        class="mobile"
        :class="{ moving: joystickMoving === true }"
        v-show="gameActive == ''"
      ></div>
    </transition>

    <Finding v-if="gameActive == 'finding'" @back="back" />
    <Horror v-if="gameActive == 'horror'" @back="back" />
    <PushBottle v-if="gameActive == 'pushBottle'" @back="back" />
    <CleanStains
      v-if="gameActive == 'cleanstains'"
      @back="back"
      :tapStatus="tapStatus"
      @setTapHide="setTapHide"
    />
    <CardGame v-if="gameActive == 'cardgame'" @back="back" />
    <DonateGame
      v-if="gameActive == 'donategame'"
      @back="back"
      :tapStatus="tapStatus"
      @setTapHide="setTapHide"
    />
    <Help
      :firstTime="firstTime"
      @openHelp="openHelp"
      v-if="gameActive == ''"
      :chrstatus="chrstatus"
    />

    <transition name="el-fade-in-linear">
      <div
        id="tap-zone"
        class="mobile"
        :class="{
          tapping: joystickTapping === true,
          tapHide: setHide,
          game: gameActive != '',
        }"
        v-show="gameActive == ''"
      ></div>
    </transition>
    <canvas id="myCanvas" ref="myCanvas" v-show="gameActive == ''"></canvas>

    <PopUp
      v-if="pop.status"
      :PopStep="pop.PopStep"
      :bgtype="pop.bgtype"
      :cat="pop.cat"
      :exit="pop.exit"
      @closePop="closePop"
      @chooseCharacter="chooseCharacter"
      @checkCharacter="checkCharacter"
      @lotterySubmit="lotterySubmit"
      :tapStatus="tapStatus"
    />
    <ChatBox
      v-if="chatData.status"
      @closeChat="closeChat"
      :name="chatData.name"
      @playgame="playgame"
      :skin="skin"
    />
    <Clock v-if="gameActive == ''" 
          @setGameEnd="setGameEnd" 
          :LOTTERYEND="LOTTERYEND" 
          :SHOWEND="SHOWEND" 
          :GAMEEND="GAMEEND" 
          @setLotteryEnd="setLotteryEnd" 
          @setShowEnd="setShowEnd"
          @setAlert="setAlert"
      />
    <Collection :collectStatus="collectStatus" v-if="gameActive == ''" />
    <LoadingPage
      v-show="homeloading"
      :percentTotal="loadingPercent"
      :percentNow="loadingNow"
      @close="closeLoading"
      :SHOWEND="SHOWEND"
    />
    <GameChat
      v-if="popData.status"
      :popData="popData"
      @chatComplete="chatComplete"
    />
    <RotateTips />
  </div>
</template>
<script>
import * as PIXI from "pixi.js";
import * as np from "nipplejs";
import { OutlineFilter } from "@pixi/filter-outline";
import Help from "@/components/Help.vue";
import PopUp from "@/components/PopUp.vue";
import ChatBox from "@/components/chat/ChatBox.vue";
import Clock from "@/components/Clock.vue";
import Collection from "@/components/Collection.vue";
import RotateTips from "@/components/RotateTips.vue";
import LoadingPage from "@/components/LoadingPage.vue";
import CleanStains from "@/components/game/CleanStains.vue";
import CardGame from "@/components/game/CardGame.vue";
import DonateGame from "@/components/game/DonateGame.vue";
import PushBottle from "@/components/game/PushBottle.vue";
import Finding from "@/components/game/Finding.vue";
import Horror from "@/components/game/Horror.vue";
import { sound } from "@pixi/sound";
import GameChat from "@/components/chat/GameChat.vue";
import { TextureUvs } from 'pixi.js';
export default {
  name: "MapSample",
  data: () => ({
    app: null,
    keys: {},
    joystickMoving: false,
    joystickTapping: false,
    joystick: null,
    tap: null,
    move: { x: 0, y: 0 },
    deltaTime: null,
    loader: null,
    character: null,
    player: null,
    map: null,
    pop: {
      status: false,
      PopStep: "story1030",
      bgtype: 1,
      cat: true,
      exit: false,
    },
    // pop: {
    //   status: true,
    //   bgtype: 1,
    //   cat: true,
    //   exit: false,
    // },
    chatData: {
      status: false,
      name: null,
    },
    loadingPercent: 100,
    loadingNow: 0,
    homeloading: true,
    firstTime: false,
    collectStatus: [false, false, false, false, false, false],
    gameActive: "",
    tapStatus: false,
    setHide: false,
    popData: {
      status: false,
      text: "",
    },
    skin: 1,
    chrstatus: false,
    LOTTERYEND:false,
    GAMEEND:false,
    SHOWEND:false
  }),
  components: {
    Help,
    PopUp,
    ChatBox,
    Clock,
    Collection,
    LoadingPage,
    CleanStains,
    CardGame,
    DonateGame,
    PushBottle,
    Finding,
    Horror,
    GameChat,
    RotateTips,
  },
  mounted() {
    let vm = this;
    this.setMediaLoad();
    this.setTap();
  },
  created() {
    window.addEventListener("resize", this.resize);
    window.addEventListener("orientationchange", this.resize);
    window.onbeforeunload = this.saveBeforeUnload;
  },
  methods: {
    init() {
      this.setCanvas();
      this.setKeyboard();
      this.setJoystick();
      this.setTap();
      this.setBackground();
      this.setObject();
      this.setSign();
      this.initGame("p2");
      console.log("goddisapperd-ver2.2");
    },
    setCanvas() {
      let vm = this;
      let myCanvas = this.$refs.myCanvas;
      this.app = new PIXI.Application({
        width: 1920,
        height: 1080,
        antialias: true,
        transparent: false,
        // resolution: window.devicePixelRatio,
        view: myCanvas,
        resolution: devicePixelRatio,
      });
      this.app.renderer.view.style.position = "absolute";
      this.app.renderer.view.style.display = "block";
      this.app.renderer.autoResize = true;
      // if (window.matchMedia("(orientation: portrait)").matches) {
      //   this.app.renderer.resize(window.innerHeight, window.innerWidth);
      //   this.windowWidth = window.innerHeight;
      //   this.windowHeight = window.innerWidth;
      //   } else {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      // }
      sound.add("map-sound", "/game/map/music.mp3");
      sound.play("map-sound", { loop: true });
      this.centerX = this.windowWidth / 2;
      this.centerY = this.windowHeight / 2;
      this.app.stage.interactive = true;
      this.app.ticker.maxFPS = 30;
      this.app.ticker.add((delta) => vm.gameLoop(delta));
      // this.closeLoading();
    },
    setTapHide() {
      this.setHide = !this.setHide;
    },
    setKeyboard() {
      let vm = this;
      window.addEventListener("keydown", vm.keyDown);
      window.addEventListener("keyup", vm.keyUp);
    },
    keyDown(e) {
      this.keys[e.keyCode] = true;
    },
    keyUp(e) {
      this.keys[e.keyCode] = false;
      this.player.gotoAndStop(0);
      this.initWalkDirection();
      this.tapdown = false;
      this.alertDone = false;
    },
    setJoystick() {
      let initPos = {
        x: 0.0,
        y: 0.0,
      };
      this.joystick = np.create({
        zone: document.getElementById("joystick-zone"),
        mode: "dynamic",
        position: { left: "75px", bottom: "75px" },
        size: "150",
        restOpacity: 0.7,
        fadeTime: 0,
      });

      this.joystick
        .on("dir:up  dir:left  dir:down  dir:right", function (evt, data) {
          console.log(evt.type);
        })
        .on("start", (evt, data) => {
          initPos.x = data.position.x;
          initPos.y = data.position.y;
          console.log(evt.type);
        })
        .on("move", (evt, data) => {
          this.move.x = ((data.position.x - initPos.x) / 50) * this.deltaTime;
          this.move.y = ((data.position.y - initPos.y) / 50) * this.deltaTime;
          if (Math.abs(this.move.x) > Math.abs(this.move.y)) {
            this.move.y = 0;
          } else {
            this.move.x = 0;
          }
        })
        .on("end", (evt, data) => {
          this.move = {
            x: 0,
            y: 0,
          };
          this.player.gotoAndStop(0);
          this.initWalkDirection();
        });
      window.joystick = this.joystick;
    },
    setTap() {
      let vm = this;
      this.tap = np.create({
        zone: document.getElementById("tap-zone"),
        mode: "static",
        position: { left: "75px", bottom: "75px" },
        size: "90",
        restOpacity: 0,
        fadeTime: 0,
        color: "rgba(255, 255, 255, 0)",
        follow: false,
      });

      this.tap
        .on("start", (evt, data) => {
          this.joystickTapping = true;
          this.tapdown = true;
          if (vm.gameActive == "") this.tapping();
          else this.tapGame();
          console.log("start")
        })
        .on("end", (evt, data) => {
          console.log("end")
          this.tapdown = false;
          this.alertDone = false;
          this.joystickTapping = false;
          vm.tapStatus = false;
        });
      window.tap = this.tap;
    },
    tapGame() {
      this.tapStatus = true;
    },
    closeLoading() {
      this.homeloading = false;
      this.lotteryDone = false;
      this.popData.status = false;
      this.chatData.status = false;
      if (localStorage.getItem("firstTime") == null) {
        this.startStory();
        this.firstTime = true;
      } else {
        let skin = null;
        let ratio = localStorage.getItem("ratio");
        let playerX = localStorage.getItem("playerX");
        let playerY = localStorage.getItem("playerY");
        let containerX = localStorage.getItem("containerX");
        let containerY = localStorage.getItem("containerY");
        let collection = localStorage.getItem("collection");
        this.lotteryDone = localStorage.getItem("lotteryDone")==="true"? true : false;

        if (
          localStorage.getItem("skin") == "p1" ||
          localStorage.getItem("skin") == "p2" ||
          localStorage.getItem("skin") == "p3"
        ) {
          skin = localStorage.getItem("skin");
        }

        if (
          skin != null &&
          ratio != null &&
          playerX != null &&
          playerY != null &&
          containerX != null &&
          containerY != null &&
          collection != null
        ) {
          this.reLocated(
            skin,
            ratio,
            parseInt(playerX),
            parseInt(playerY),
            parseInt(containerX),
            parseInt(containerY),
            collection
          );
        } else if (skin != null) {
          this.initGame(skin);
        } else {
          this.initGame("p2");
        }

        // if (this.GAMEEND && !this.SHOWEND ) {
        //   this.pop = {
        //     status: true,
        //     PopStep: "story1030",
        //     bgtype:2
        //   };
        // }
      }
      this.resize();
    },
    startStory() {
      this.firstTime = false;
      // if (this.GAMEEND && !this.SHOWEND) {
      //   this.pop = {
      //     status: true,
      //     PopStep: "story1030",
      //     bgtype:2
      //   };
      // } else {
        this.pop = {
          status: true,
          PopStep: "story",
          cat: true,
        };
      //}
    },
    setMediaLoad() {
      this.loader = new PIXI.Loader();
      this.loader.reset();
      this.loader
        .add([
          { name: "sheet", url: "/sheet/1.json" },
          { name: "bgSheet", url: "/sheet/2.json" },
          { name: "npccarSheet", url: "/sheet/3.json" },
          { name: "routeSheet", url: "/sheet/4.json" },
          { name: "church", url: "/sheet/church.png" },
          { name: "forest", url: "/sheet/forest.png" },
          { name: "hospital", url: "/sheet/hospital.png" },
          { name: "landfill", url: "/sheet/landfill.png" },
          { name: "liveapartment", url: "/sheet/liveapartment.png" },
          { name: "square", url: "/sheet/square.png" },
        ])
        .load(this.init);

      this.loader.onProgress.add((event) => {
        this.loadingNow = this.loader.progress;
      });
      this.loader.onComplete.add((event) => {
        this.loadingNow = 100;
      });
    },
    setBackground() {
      let bgSheet = this.loader.resources.bgSheet.spritesheet;
      this.background = new PIXI.Sprite(bgSheet.textures["background.png"]);

      let routeSheet = this.loader.resources.routeSheet.spritesheet;
      this.route = new PIXI.Sprite(routeSheet.textures["route.png"]);
      this.route.interactive = true;

      this.container = new PIXI.Container();
      this.container.addChild(this.route, this.background);

      this.baseTexture = this.route.texture.baseTexture;
      this.genColorMap(this.baseTexture);
      this.colormap = this.baseTexture.colormap;
      this.data = this.colormap.data;
      let count = 0;
      let tmpArr = [];
      let lineArr = [];
      this.routeArr = [];
      for (let i = 0, len = this.data.length; i <= len; i++) {
        if (count > 3) {
          lineArr.push(tmpArr);
          tmpArr = [];
          count = 0;
        }
        if (lineArr.length === this.route.width) {
          this.routeArr.push(lineArr);
          lineArr = [];
        }
        tmpArr.push(this.data[i]);
        count++;
      }
    },
    setObject() {
      let sheet = this.loader.resources.sheet.spritesheet;

      this.church = new PIXI.Sprite(this.loader.resources["church"].texture);
      this.forest = new PIXI.Sprite(this.loader.resources["forest"].texture);
      this.hospital = new PIXI.Sprite(
        this.loader.resources["hospital"].texture
      );
      this.landfill = new PIXI.Sprite(
        this.loader.resources["landfill"].texture
      );
      this.liveapartment = new PIXI.Sprite(
        this.loader.resources["liveapartment"].texture
      );
      this.square = new PIXI.Sprite(this.loader.resources["square"].texture);

      this.church_top = new PIXI.Sprite(
        this.loader.resources["church"].texture
      );
      this.forest_top = new PIXI.Sprite(
        this.loader.resources["forest"].texture
      );
      this.hospital_top = new PIXI.Sprite(
        this.loader.resources["hospital"].texture
      );
      this.landfill_top = new PIXI.Sprite(
        this.loader.resources["landfill"].texture
      );
      this.liveapartment_top = new PIXI.Sprite(
        this.loader.resources["liveapartment"].texture
      );
      this.square_top = new PIXI.Sprite(
        this.loader.resources["square"].texture
      );

      this.bar = new PIXI.Sprite(sheet.textures["bar.png"]);
      this.cemetery = new PIXI.Sprite(sheet.textures["cemetery.png"]);
      this.cityhall = new PIXI.Sprite(sheet.textures["cityhall.png"]);
      this.conference = new PIXI.Sprite(sheet.textures["conference.png"]);
      this.court = new PIXI.Sprite(sheet.textures["court.png"]);
      this.house = new PIXI.Sprite(sheet.textures["house.png"]);
      this.nightmarket = new PIXI.Sprite(sheet.textures["nightmarket.png"]);
      this.policeoffice = new PIXI.Sprite(sheet.textures["policeoffice.png"]);
      this.salon = new PIXI.Sprite(sheet.textures["salon.png"]);

      this.bar_top = new PIXI.Sprite(sheet.textures["bar.png"]);
      this.cemetery_top = new PIXI.Sprite(sheet.textures["cemetery.png"]);
      this.cityhall_top = new PIXI.Sprite(sheet.textures["cityhall.png"]);
      this.conference_top = new PIXI.Sprite(sheet.textures["conference.png"]);
      this.court_top = new PIXI.Sprite(sheet.textures["court.png"]);
      this.house_top = new PIXI.Sprite(sheet.textures["house.png"]);
      this.nightmarket_top = new PIXI.Sprite(sheet.textures["nightmarket.png"]);
      this.policeoffice_top = new PIXI.Sprite(
        sheet.textures["policeoffice.png"]
      );
      this.salon_top = new PIXI.Sprite(sheet.textures["salon.png"]);

      this.ray = new PIXI.AnimatedSprite(sheet.animations[`ray`]);
      this.ray.play();
      this.ray.animationSpeed = 0.1;
      this.ray.x = 770;
      this.ray.y = 540;
      this.ray_top = new PIXI.AnimatedSprite(sheet.animations[`ray`]);
      this.ray_top.play();
      this.ray_top.animationSpeed = 0.1;
      this.ray_top.x = 770;
      this.ray_top.y = 540;

      let npccarSheet = this.loader.resources.npccarSheet.spritesheet;
      this.npccar = new PIXI.Sprite(npccarSheet.textures["npccar.png"]);
      this.npccar_top = new PIXI.Sprite(npccarSheet.textures["npccar.png"]);

      this.believer = new PIXI.AnimatedSprite(sheet.animations[`believer`]);
      this.believer.play();
      this.believer.animationSpeed = 0.02;
      this.believer.x = 1135;
      this.believer.y = 385;
      this.believer_top = new PIXI.AnimatedSprite(sheet.animations[`believer`]);
      this.believer_top.play();
      this.believer_top.animationSpeed = 0.02;
      this.believer_top.x = 1135;
      this.believer_top.y = 385;

      this.bottomContainer = new PIXI.Container();
      this.topContainer = new PIXI.Container();

      this.buildingArr = [
        this.square,
        this.nightmarket,
        this.landfill,
        this.forest,
        this.bar,
        this.church,
        this.liveapartment,
        this.hospital,
        this.cityhall,
        this.house,
        this.conference,
        this.salon,
        this.cemetery,
        this.policeoffice,
        this.court,
      ];

      this.topBuildingArr = [
        this.square_top,
        this.nightmarket_top,
        this.landfill_top,
        this.forest_top,
        this.bar_top,
        this.church_top,
        this.liveapartment_top,
        this.hospital_top,
        this.cityhall_top,
        this.house_top,
        this.conference_top,
        this.salon_top,
        this.cemetery_top,
        this.policeoffice_top,
        this.court_top,
      ];

      this.buildingPositionArr = [
        { name: "square", x: 503, y: 323 },
        { name: "nightmarket", x: 56, y: 0 },
        { name: "landfill", x: 503, y: 3 },
        { name: "forest", x: 874, y: 1 },
        { name: "bar", x: 72, y: 520 },
        { name: "church", x: 1078, y: 292 },
        { name: "liveapartment", x: 71, y: 687 },
        { name: "hospital", x: 407, y: 812 },
        { name: "cityhall", x: 743, y: 762 },
        { name: "house", x: 1077, y: 510 },
        { name: "conference", x: 72, y: 1092 },
        { name: "salon", x: 406, y: 1103 },
        { name: "cemetery", x: 1125, y: 0 },
        { name: "policeoffice", x: 698, y: 1083 },
        { name: "court", x: 1080, y: 1097 },
      ];

      this.buildingArr.forEach((element, index) => {
        element.position.x = this.buildingPositionArr[index].x;
        element.position.y = this.buildingPositionArr[index].y;
        this.bottomContainer.addChild(element);
      });

      this.topBuildingArr.forEach((element, index) => {
        element.position.x = this.buildingPositionArr[index].x;
        element.position.y = this.buildingPositionArr[index].y;
        this.topContainer.addChild(element);
      });

      this.bottomContainer.addChild(this.ray, this.npccar, this.believer);
      this.topContainer.addChild(
        this.ray_top,
        this.npccar_top,
        this.believer_top
      );

      this.tempBuilding = 150; // square == 150
      this.tempTopShow = false;
      this.topContainer.visible = this.tempTopShow;
    },
    setSign() {
      let sheet = this.loader.resources.sheet.spritesheet;

      this.npcBubble = new PIXI.AnimatedSprite(sheet.animations[`dot`]);
      this.npcBubble.play();
      this.npcBubble.animationSpeed = 0.1;

      this.signContainer = new PIXI.Container();

      this.signPopArr = [
        {
          name: "【小鎮廣場】",
          text: "中正市的廣場，也是與「你的世界」的連結傳送門。請將蒐集完的線索到這裡交給天神。",
        },
        {
          name: "【夜市】",
          text: "人聲鼎沸的夜市，各式各樣的小吃和商品或許都找得到。",
        },
        {
          name: "【垃圾回收場】",
          text: "小鎮集中的垃圾回收場，或許能在這裡發現人們丟棄的物品？",
        },
        {
          name: "【森林】",
          text: "有不少都市傳說的森林，也因此吸引了鎮上的年輕人到此探險。",
        },
        {
          name: "【酒吧】",
          text: "氣氛輕鬆的酒吧，年輕人們特別喜歡在這裡放鬆談心，或許能打聽到什麼消息？",
        },
        {
          name: "【神秘宗教區】",
          text: "不管幾點總是燈火通明的區域，信徒們似乎不間斷的在聚會與儀式。",
        },
        {
          name: "【直播公寓】",
          text: "每到深夜，這裡將會化作人們寂寞的出口⋯⋯",
        },
        {
          name: "【醫院】",
          text: "似乎有人正發送能讓人感到快樂的「祝福糖漿」，喝了身體會比較快好嗎？",
        },
        {
          name: "【市長辦公室】",
          text: "曾建國市長連任多年的辦公室，日理萬機想必很辛苦吧？",
        },
        {
          name: "【住宅區】",
          text: "外牆上有著大幅潑漆的痕跡，看起來是一股強烈情緒宣洩後的結果。這裡遭遇了什麼事嗎？",
        },
        {
          name: "【電視台】",
          text: "看起來擠滿了媒體⋯⋯，有什麼大事發生了嗎？",
        },
        {
          name: "【美容院】",
          text: "這裡有經驗老道的理髮師傅，無論是美髮造型或男士修容都難不倒他們。",
        },
        {
          name: "【墓地】",
          text: "氣氛詭譎的墓地。平常會有人來這裡嗎？",
        },
        {
          name: "【警察局】",
          text: "或許問問警察們，能夠知道近期小鎮內發生了什麼不尋常的事。",
        },
        {
          name: "【網球場】",
          text: "白天的球場有不少人正在運動，一到了晚上卻變成了幫派囉囉們聚會的場所。",
        },
      ];

      this.npcBubblePositionArr = [
        { name: null, x: 100, y: 100 },
        { name: "nightMarket", x: 405, y: 200 },
        { name: "recycle", x: 557, y: 24 },
        { name: "run", x: 1010, y: 130 },
        { name: "accusefive", x: 404, y: 500 },
        { name: "sunny", x: 270, y: 615 },
        { name: null, x: 100, y: 100 }, //index 6 == ray
        { name: null, x: 100, y: 100 },
        { name: "pepe", x: 260, y: 895 },
        { name: "cometlady", x: 415, y: 857 },
        { name: "chenwang", x: 880, y: 903 },
        { name: "green", x: 1092, y: 810 },
        { name: "reporter", x: 280, y: 1190 },
        { name: "salon", x: 595, y: 1110 },
        { name: "police", x: 936, y: 1057 },
      ];

      this.tempNPC = 0; // null == 0
      this.npcBubble.visible = false;
      this.signContainer.addChild(this.npcBubble);
    },
    initGame(skin) {
      this.setPlayer(skin);

      this.ratio = 1;

      if (this.windowHeight > 800) {
        this.ratio = 1.4;
      } else if (this.windowHeight > 440) {
        this.ratio = 1.2;
      } else {
        this.ratio = 0.9;
      }

      this.originX = 770 * this.ratio;
      this.originY = 530 * this.ratio;

      this.setLayout(
        this.ratio,
        this.centerX,
        this.centerY,
        -this.originX + this.centerX,
        -this.originY + this.centerY
      );

      this.ready();
    },

    setPlayer(skin) {
      this.skin = skin;
      let playerSheet = this.loader.resources.sheet.spritesheet;

      this.texture_right = playerSheet.animations[skin + `/right`];
      this.texture_left = playerSheet.animations[skin + `/left`];
      this.texture_up = playerSheet.animations[skin + `/up`];
      this.texture_down = playerSheet.animations[skin + `/down`];

      this.player = new PIXI.AnimatedSprite(this.texture_down);

      this.initWalkDirection();
    },

    setLayout(ratio, playerX, playerY, containerX, containerY) {
      this.mapScale(ratio);
      this.playerLocated(playerX, playerY, containerX, containerY);
    },

    mapScale(ratio) {
      this.ratio = ratio;
      this.tempScale = this.ratio;
      this.player.scale.x = ratio;
      this.player.scale.y = ratio;
      this.container.scale.x = ratio;
      this.container.scale.y = ratio;
      this.bottomContainer.scale.x = ratio;
      this.bottomContainer.scale.y = ratio;
      this.topContainer.scale.x = ratio;
      this.topContainer.scale.y = ratio;
      this.signContainer.scale.x = ratio;
      this.signContainer.scale.y = ratio;
    },

    playerLocated(playerX, playerY, containerX, containerY) {
      this.player.x = playerX;
      this.player.y = playerY;
      this.container.x = containerX;
      this.container.y = containerY;
      this.bottomContainer.x = this.container.x;
      this.bottomContainer.y = this.container.y;
      this.topContainer.x = this.container.x;
      this.topContainer.y = this.container.y;
      this.signContainer.x = this.container.x;
      this.signContainer.y = this.container.y;
    },

    ready() {
      for (var i = this.app.stage.children.length - 1; i >= 0; i--) {
        this.app.stage.removeChild(this.app.stage.children[i]);
      }
      this.app.stage.addChild(this.container);
      this.app.stage.addChild(this.bottomContainer);
      this.app.stage.addChild(this.player);
      this.app.stage.addChild(this.topContainer);
      this.app.stage.addChild(this.signContainer);
      this.openGame("");
    },
    gameLoop(delta) {
      if (this.gameActive == "") {
        this.deltaTime = delta * 2; //effect movespeed
        this.play(delta);
        this.joystickMoving = this.move.x || this.move.y ? true : false;
        this.joystick.options.size = this.windowWidth < 640 ? "90" : "150";
        this.tap.options.size = this.windowWidth < 640 ? "90" : "150";

        //joystick
        if (this.move.y < 0) {
          this.playerMove("W", -this.move.y);
        }
        if (this.move.y > 0) {
          this.playerMove("S", this.move.y);
        }
        if (this.move.x < 0) {
          this.playerMove("A", -this.move.x);
        }
        if (this.move.x > 0) {
          this.playerMove("D", this.move.x);
        }

        //W
        if (this.keys["87"] || this.keys["38"]) {
          this.playerMove("W", this.deltaTime);
        }
        //A
        if (this.keys["65"] || this.keys["37"]) {
          this.playerMove("A", this.deltaTime);
        }
        //S
        if (this.keys["83"] || this.keys["40"]) {
          this.playerMove("S", this.deltaTime);
        }
        //D
        if (this.keys["68"] || this.keys["39"]) {
          this.playerMove("D", this.deltaTime);
        }

        if (this.keys["32"]) {
          this.tapping();
          this.tapdown = true;
        }
      }
    },
    play(delta) {},
    playerMove(direction, moveGap) {
      let playerOriginX = this.windowWidth / 2 - this.player.width / 2;
      let playerOriginY = this.windowHeight / 2 - this.player.height / 2;

      moveGap = this.moveable(direction, moveGap);

      if (direction == "W") {
        if (!this.up) {
          this.playerWalking(this.texture_up);
          this.initWalkDirection();
          this.up = true;
        }
        if (
          (this.container.y >= 0 && this.player.y > 0) ||
          this.player.y > playerOriginY
        ) {
          this.player.y -= moveGap;
        } else if (this.container.y < 0 && this.player.y < playerOriginY) {
          this.container.y += moveGap;
        }
      } else if (direction == "A") {
        if (!this.left) {
          this.playerWalking(this.texture_left);
          this.initWalkDirection();
          this.left = true;
        }
        if (
          (this.container.x >= 0 && this.player.x > 0) ||
          this.player.x > playerOriginX
        ) {
          this.player.x -= moveGap;
        } else if (this.container.x < 0 && this.player.x < playerOriginX) {
          this.container.x += moveGap;
        }
      } else if (direction == "S") {
        if (!this.down) {
          this.playerWalking(this.texture_down);
          this.initWalkDirection();
          this.down = true;
        }
        if (
          (this.container.y <= this.windowHeight - this.container.height &&
            this.player.y < this.windowHeight - this.player.height) ||
          this.player.y < playerOriginY
        ) {
          this.player.y += moveGap;
        } else if (
          this.container.y > this.windowHeight - this.container.height &&
          this.player.y > playerOriginY
        ) {
          this.container.y -= moveGap;
        }
      } else if (direction == "D") {
        if (!this.right) {
          this.playerWalking(this.texture_right);
          this.initWalkDirection();
          this.right = true;
        }
        if (
          (this.container.x <= this.windowWidth - this.container.width &&
            this.player.x < this.windowWidth - this.player.width) ||
          this.player.x < playerOriginX
        ) {
          this.player.x += moveGap;
        } else if (
          this.container.x > this.windowWidth - this.container.width &&
          this.player.x > playerOriginX
        ) {
          this.container.x -= moveGap;
        }
      }

      this.triggerObject();

      this.bottomContainer.x = this.container.x;
      this.bottomContainer.y = this.container.y;
      this.topContainer.x = this.container.x;
      this.topContainer.y = this.container.y;
      this.signContainer.x = this.container.x;
      this.signContainer.y = this.container.y;
    },
    playerWalking(texture_direction) {
      this.player.textures = texture_direction;
      this.player.play();
      this.player.animationSpeed = 0.1;
    },
    initWalkDirection() {
      this.right = false;
      this.left = false;
      this.up = false;
      this.down = false;
    },
    moveable(direction, moveGap) {
      let pX = (this.player.x - this.container.x) / this.ratio;
      let pY = (this.player.y - this.container.y) / this.ratio;
      let pW = this.player.width / 2 / this.ratio;
      let pH = this.player.height / this.ratio;
      let mG = moveGap;
      let stop = "[255,255,255,255]";

      switch (direction) {
        case "W":
          moveGap =
            JSON.stringify(
              this.routeArr[parseInt(pY - mG)][parseInt(pX - pW)]
            ) === stop ||
            JSON.stringify(
              this.routeArr[parseInt(pY - mG)][parseInt(pX + pW)]
            ) === stop
              ? 0
              : moveGap;
          break;
        case "A":
          moveGap =
            JSON.stringify(
              this.routeArr[parseInt(pY)][parseInt(pX - pW - mG)]
            ) === stop
              ? 0
              : moveGap;
          break;
        case "S":
          moveGap =
            JSON.stringify(
              this.routeArr[parseInt(pY + mG)][parseInt(pX - pW)]
            ) === stop ||
            JSON.stringify(
              this.routeArr[parseInt(pY + mG)][parseInt(pX + pW)]
            ) === stop
              ? 0
              : moveGap;
          break;
        case "D":
          moveGap =
            JSON.stringify(
              this.routeArr[parseInt(pY)][parseInt(pX + pW + mG)]
            ) === stop
              ? 0
              : moveGap;
          break;
        default:
          console.log("moveable() has some wrong");
      }

      return moveGap;
    },
    triggerObject() {
      let pX = (this.player.x - this.container.x) / this.ratio;
      let pY = (this.player.y - this.container.y) / this.ratio;
      let indexOfBuilding = this.routeArr[parseInt(pY)][parseInt(pX)][0];
      let indexOfNPC = this.routeArr[parseInt(pY)][parseInt(pX)][1];
      let isTopShow =
        this.routeArr[parseInt(pY)][parseInt(pX)][2] == 255 ? true : false;

      if (this.tempTopShow != isTopShow) {
        this.tempTopShow = isTopShow;
        this.topContainer.visible = this.tempTopShow;
      }

      if (this.tempBuilding != indexOfBuilding) {
        this.tempBuilding = indexOfBuilding;

        this.buildingArr.forEach((element) => {
          element.filters = null;
        });
        this.topBuildingArr.forEach((element) => {
          element.filters = null;
        });
        if (indexOfBuilding / 10 < 15 && indexOfBuilding % 10 == 0) {
          this.buildingArr[indexOfBuilding / 10].filters = [
            new OutlineFilter(5, 0x4cffff),
          ];
          this.topBuildingArr[indexOfBuilding / 10].filters = [
            new OutlineFilter(5, 0x4cffff),
          ];
          this.popData.text = this.signPopArr[indexOfBuilding / 10].text;
          this.popData.name = this.signPopArr[indexOfBuilding / 10].name;
          this.popData.status = true;
        }
      }

      if (this.tempNPC != indexOfNPC) {
        this.tempNPC = indexOfNPC;
        if (indexOfNPC / 10 < 15 && indexOfNPC % 10 == 0) {
          if (this.npcBubblePositionArr[indexOfNPC / 10].name != null) {
            this.npcBubble.visible = true;
            this.npcBubble.x = this.npcBubblePositionArr[indexOfNPC / 10].x;
            this.npcBubble.y = this.npcBubblePositionArr[indexOfNPC / 10].y;
          } else {
            this.npcBubble.visible = false;
            this.chatData.status = false;
          }
        }
      }
    },
    lotterySubmit() {
      this.lotteryDone = true;
      localStorage.setItem("lotteryDone", true);
      this.alertDone = false;
    },
    tapping() {
      console.log("this.tapdown: " + this.tapdown);
      console.log("this.alertDone: " + this.alertDone);
      if (this.tapdown) {
        this.popData.status = false;

        let pX = (this.player.x - this.container.x) / this.ratio;
        let pY = (this.player.y - this.container.y) / this.ratio;

        let indexOfNPC = this.routeArr[parseInt(pY)][parseInt(pX)][1];

        if (indexOfNPC / 10 < 15 && indexOfNPC % 10 == 0) {
          if (this.npcBubblePositionArr[indexOfNPC / 10].name != null) {
            this.chatData.name =
              this.npcBubblePositionArr[indexOfNPC / 10].name;
            this.chatData.status = true;
          } else {
            this.chatData.status = false;
          }
        }

        if (!this.collectStatus.includes(false) && indexOfNPC == 60) {
          if (!this.lotteryDone) {
            if (this.LOTTERYEND) {
              this.pop = {
                status: true,
                PopStep: "lotteryEnd",
                exit: true,
              };
            } else {
              this.pop = {
                status: true,
                PopStep: "lottery",
                cat: true,
                exit: true,
              };
            }
          } else {
            if (!this.alertDone) {
              console.log("* 你已經填過資料囉  *");
              window.alert(" * 你已經填過資料囉  *");
              this.alertDone = true;
            }
          }
        }
      }
    },
    genColorMap(baseTex) {
      if (!baseTex.resource) {
        console.log("butts");
        return false;
      }
      const imgSource = baseTex.resource.source;
      let canvas = null;
      if (!imgSource) {
        return false;
      }

      let context = null;
      if (imgSource.getContext) {
        canvas = imgSource;
        context = canvas.getContext("2d");
      } else if (imgSource instanceof Image) {
        canvas = document.createElement("canvas");
        canvas.width = imgSource.width;
        canvas.height = imgSource.height;
        context = canvas.getContext("2d");
        context.drawImage(imgSource, 0, 0);
      } else {
        return false;
      }

      const w = canvas.width,
        h = canvas.height;
      baseTex.colormap = context.getImageData(0, 0, w, h);
      return true;
    },
    closeChat() {
      this.chatData.status = false;
    },
    chooseCharacter() {
      this.pop.PopStep = "character";
      this.pop.cat = false;
    },
    checkCharacter(index) {
      this.pop.PopStep = "controlhelp";
      this.pop.exit = "true";

      if (index == 0) {
        this.initGame("p1");
      } else if (index == 1) {
        this.initGame("p3");
      } else if (index == 2) {
        this.initGame("p2");
      }
      this.chrstatus = true;
      localStorage.setItem("firstTime", false);
    },
    closePop() {
      if (this.pop.PopStep == "collectionend") {
        this.initGame(this.skin);
      }
      this.pop.status = false;
    },
    openGame(type) {
      // switch (type) {
      //   case "pushBottole":
      //     break;
      //   case "finding":
      //     break;
      //   case "horror":
      //     break;
      //   default:
      //     console.log("OpenGame Something Wrong");
      // }
    },
    openHelp(type) {
      if (type == "controlhelp") {
        this.pop = {
          status: true,
          PopStep: "controlhelp",
          exit: true,
        };
      } else {
        this.pop = {
          status: true,
          PopStep: "faq",
          exit: true,
        };
      }
    },
    playgame(name) {
      sound.stop("map-sound");
      switch (name) {
        case "green":
          this.gameActive = "cleanstains";
          break;
        case "cometlady":
          this.gameActive = "cardgame";
          break;
        case "pepe":
          this.gameActive = "donategame";
          break;
        case "sunny":
          this.gameActive = "pushBottle";
          break;
        case "chenwang":
          this.gameActive = "finding";
          break;
        case "run":
          this.gameActive = "horror";
          break;
        default:
          break;
      }
      this.closeChat();
    },
    back(gameIndex) {
      sound.play("map-sound", { loop: true });
      this.gameActive = "";

      if (gameIndex < 6) {
        this.collectStatus[gameIndex] = true;
        localStorage.setItem("collection", this.collectStatus);

        if (!this.collectStatus.includes(false)) {
          this.pop = {
            status: true,
            PopStep: "collectionend",
          };
        }
      }
    },
    saveConfirmation() {
      if (confirm("需要儲存目前遊戲進度嗎？")) {
        localStorage.setItem("skin", this.skin);
        localStorage.setItem("playerX", this.player.x);
        localStorage.setItem("playerY", this.player.y);
        localStorage.setItem("containerX", this.container.x);
        localStorage.setItem("containerY", this.container.y);
        localStorage.setItem("ratio", this.ratio);
        localStorage.setItem("collection", this.collectStatus);
      } else {
        localStorage.setItem("clipboard_unfinishedconfig", "");
        return;
      }
    },
    saveBeforeUnload() {
      setTimeout(this.saveConfirmation, 0);
      return "You have unsaved changes";
    },
    reLocated(
      skin,
      ratio,
      playerX,
      playerY,
      containerX,
      containerY,
      collection
    ) {
      this.setPlayer(skin);
      this.setLayout(ratio, playerX, playerY, containerX, containerY);
      this.ready();

      if (collection != null) {
        let collectArr = collection.split(",");
        collectArr.forEach((e, i) => {
          if (e === "true") {
            this.$set(this.collectStatus, i, true);
          }
        });
      }
    },
    resize() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        let vh = window.innerWidth * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        // this.app.renderer.resize(window.innerHeight, window.innerHeight);
        // this.windowWidth = window.innerHeight;
        // this.windowHeight = window.innerHeight;
      } else {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        // if (this.windowHeight > 800 && this.tempScale != 1.4) {
        //   this.ratio = 1.4;
        // } else if (this.windowHeight > 440 && this.tempScale != 1.2) {
        //   this.ratio = 1.2;
        // } else if (this.windowHeight <= 440 && this.tempScale != 0.9) {
        //   this.ratio = 0.9;
        // }

        // if (this.tempScale != this.ratio) {
        //   this.mapScale(this.ratio);
        // }

        let playerX = null;
        let playerY = null;
        let containerX = null;
        let containerY = null;

        if (this.player.x == this.centerX) {
          this.centerX = this.windowWidth / 2;
          playerX = this.centerX;
          containerX = this.container.x + (this.centerX - this.player.x);
        } else {
          let ratio = this.windowWidth / (this.centerX * 2);
          this.centerX = this.windowWidth / 2;
          playerX = this.player.x * ratio;
          containerX = this.container.x + playerX - this.player.x;
        }

        if (this.player.y == this.centerY) {
          this.centerY = this.windowHeight / 2;
          playerY = this.centerY;
          containerY = this.container.y + (this.centerY - this.player.y);
        } else {
          let ratio = this.windowHeight / (this.centerY * 2);
          this.centerY = this.windowHeight / 2;
          playerY = this.player.y * ratio;
          containerY = this.container.y + playerY - this.player.y;
        }
        this.playerLocated(playerX, playerY, containerX, containerY);
      }
    },
    chatComplete() {
    },
    setGameEnd(){
      this.GAMEEND = true;
    },
    setAlert(){
      this.pop = {
        status: true,
        PopStep: "story1030",
        bgtype:2
      };
    },
    setLotteryEnd(){
      this.LOTTERYEND = true;
    },
    setShowEnd(){
      this.SHOWEND = true;
    }
  },
  destroyed() {
    for (var i = this.app.stage.children.length - 1; i >= 0; i--) {
      this.app.stage.children[i].destroy({ texture: true, baseTexture: true });
    }
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("orientationchange", this.resize);
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
    if (this.joystick) {
      this.joystick.destroy();
    }
    if (this.tap) {
      this.tap.destroy();
    }
  },
};

if (window.matchMedia("(orientation: portrait)").matches) {
  let vh = window.innerWidth * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
{
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/_media.scss";
@import "@/assets/scss/_variable.scss";
.mobile {
  display: none;
  @include multiBreakpoint(tabletS, phone) {
    display: block;
  }
}
.desktop {
  @include multiBreakpoint(tabletS, phone) {
    display: none;
  }
}
.map {
  // position: relative;
  height: 100%;
  canvas {
    // height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    width: 100%;
  }
  .help {
    top: 20px;
    right: 15px;
    z-index: 999999;
    @include breakpoint(phone) {
      top: -16px;
      right: -16px;
    }
  }
  .pushBottle {
    top: 20px;
    right: 15px;
    @include breakpoint(phone) {
      top: -16px;
      right: -16px;
    }
  }
  .clock {
    position: absolute;
    // left: 4%;
    // top: 18%;

    left: 50px;
    top: 150px;
    @include multiBreakpoint(tablet, tabletS) {
      left: 50px;
      top: 125px;
    }
    @include breakpoint(phone) {
      top: 64px;
      left: 16px;
    }
  }
  .collection {
    position: absolute;
    // top: 6%;
    // left: 4%;
    top: 50px;
    left: 50px;
    @include breakpoint(phone) {
      top: 15px;
      left: 16px;
    }
  }
  #tap-zone {
    z-index: 99999;
    &.game {
      z-index: 10000000;
      //@include absXcenter
    }
  }
  .tapHide {
    display: none;
  }
}
</style>
