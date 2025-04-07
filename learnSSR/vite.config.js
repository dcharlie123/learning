import path from 'path';
import {defineConfig} from 'vite'
import vuePlugin from '@vitejs/plugin-vue'

export default defineConfig({
  plugins:[
    vuePlugin(),
  ],
  server:{
    port:8000
  },
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'src')
    }
  }
})