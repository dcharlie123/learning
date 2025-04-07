<template>
  <div class="time">{{ time }}</div>
  <div>
    <router-link :to="{ name: 'home' }">Home</router-link>
    <router-link :to="{ name: 'about' }">About</router-link>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'

const time = ref('');
onMounted(() => {
  time.value = new Date().toLocaleString();
  setInterval(() => {
    time.value = new Date().toLocaleString();
  }, 1000);
});
</script>

<style scoped>
.time {
  font-size: 20px;
  color: red;
}
</style>