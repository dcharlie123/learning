<template>
  <div id="app">
    <div class="canvas-container"></div>
  </div>
</template>

<script>


import Game from './game/index'
export default {
  name: "App",
  data() {
    return {
      scene: null,
      targetX: 0,
      targetY: 0,
      radian: null,
      rotation: null,
      speed: 5,
      press: false,
      touchDown: false,
    };
  },
  mounted() {
    this.init();
  },
  components: {},
  methods: {
    init() {
        let game=new Game()
        game.init()
    },
  },
};
</script>

<style>
html,
body {
  margin: 0 auto;
  padding: 0;
  width: 100%;
  height: 100%;
   min-width: 320px;
  max-width: 540px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
 
  
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  /* margin-top: 60px; */
}
#app canvas {
  width: 100%;
  height: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: block;
}
</style>
