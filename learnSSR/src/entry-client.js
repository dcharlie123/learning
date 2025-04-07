import { createApp } from './main';

const { app, router } = createApp();
// if (window.__INITIAL_STATE__) {
//   store.state.value = JSON.parse(JSON.stringify(window.__INITIAL_STATE__))
// }
router.isReady().then(() => {
  console.log(11111)
  app.mount('#app');
})