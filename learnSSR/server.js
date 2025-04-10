import express from 'express';
import fs from 'node:fs'
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
const isProduction = process.env.NODE_ENV === 'production';
export async function createServer(root = process.cwd(), isProd = isProduction) {
  // 获取跨平台路径
  console.log(fileURLToPath(import.meta.url))
  // 返回目录
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  console.log(__dirname)
  const resolve = (p) => path.resolve(__dirname, p);
  const app = express();
  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : '';
  const manifest = isProd ? JSON.parse(fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8')) : {};

  let vite;
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100
        }
      },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  } else {
    // app.use('/', express.static(resolve('dist/client/')))
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false
      })
    );
  }



  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      console.log('url', url)
      let template, render;
      if (!isProd) {
        // always read fresh template in dev
        // 获取模板
        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render;
      } else {
        template = indexProd;
        render = (await import('./dist/server/entry-server.js')).render;
      }
      const [appHtml, links] = await render(url, manifest);
      const html = template
        .replace(`<!--preload-links-->`, links)
        .replace(`<!--ssr-outlet-->`, appHtml)
      // 返回内容
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })
  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(8000, () => {
      console.log('http://localhost:8000');
    })
  );
}