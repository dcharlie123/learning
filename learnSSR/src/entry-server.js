import { createApp } from './main';
import { renderToString } from 'vue/server-renderer';
import { basename } from 'node:path'
// 初始化vue、render
export async function render(url, manifest) {
  // 拿到实例
  const { app, router } = createApp();
  try {
    // 路由跳转，在服务端渲染对应组件模板
    await router.push(url);
    // 确保初始化之后执行
    await router.isReady();
    const ctx = {};
    // 渲染模板
    const html = await renderToString(app, ctx);
    // 处理css模板等内容 内容
    const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
    // const teleports = renderTeleports(ctx.teleports);
    //拿到全局数据
    // const state = JSON.stringify(store.state.value);
    return [html, preloadLinks];
  } catch (error) {
    console.log(error);
  }
}

function renderPreloadLinks(modules, manifest) {
  let links = ''
  const seen = new Set()
  modules.forEach((id) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file)
          const filename = basename(file)
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

function renderPreloadLink(file) {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`
  } else {
    // TODO
    return ''
  }
}