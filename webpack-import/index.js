var modules = {};
var cache = {};
function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  // 缓存和创建模块对象
  var module = (cache[moduleId] = {
    exports: {},
  });
  // 运行模块代码
  modules[moduleId](module, module.exports, require, moduleId);
  return module.exports;
}
function webpackJsonpCallback([chunkIds, moreModules]) {
  debugger;
  const result = [];
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i];
    result.push(installedChunks[chunkId][0]);
    installedChunks[chunkId] = 0; // 表示此代码块已经下载完毕
  }

  // 将代码块合并到 modules 对象中去
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }
  //依次将require.e方法中的promise变为成功态
  while (result.length) {
    result.shift()();
  }
}
var installedChunks = {
  main: 0,
};
require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key],
    });
  }
};
require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  Object.defineProperty(exports, "__esModule", { value: true });
};
require.m = modules;
require.f = {};
require.l = function (url) {
  let script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
};
require.f.j = function (chunkId, promises) {
  let installedChunkData;
  // 当前代码块的数据
  const promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  });
  promises.push((installedChunkData[2] = promise));
  // 获取模块的访问路径
  const url = chunkId + ".main.js";

  require.l(url);
};
require.e = function (chunkId) {  
  debugger
  let promises = [];
  require.f.j(chunkId, promises);
  console.log(promises);
  return Promise.all(promises);
};
var chunkLoadingGlobal = (window["webpack"] = []);
chunkLoadingGlobal.push = webpackJsonpCallback;
require
  .e("hello")
  .then(require.bind(require, "./src/hello.js"))
  .then((result) => console.log(result));