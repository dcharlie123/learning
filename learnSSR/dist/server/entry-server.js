import { useSSRContext, ref, onMounted, resolveComponent, withCtx, createTextVNode, createSSRApp } from "vue";
import { ssrInterpolate, ssrRenderComponent, renderToString } from "vue/server-renderer";
import { createMemoryHistory, createRouter as createRouter$1 } from "vue-router";
import { basename } from "node:path";
const app_vue_vue_type_style_index_0_scoped_98789c05_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const time = ref("");
    onMounted(() => {
      time.value = (/* @__PURE__ */ new Date()).toLocaleString();
      setInterval(() => {
        time.value = (/* @__PURE__ */ new Date()).toLocaleString();
      }, 1e3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      const _component_router_view = resolveComponent("router-view");
      _push(`<!--[--><div class="time" data-v-98789c05>${ssrInterpolate(time.value)}</div><div data-v-98789c05>`);
      _push(ssrRenderComponent(_component_router_link, { to: { name: "home" } }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, { to: { name: "about" } }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`About`);
          } else {
            return [
              createTextVNode("About")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div data-v-98789c05>`);
      _push(ssrRenderComponent(_component_router_view, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-98789c05"]]);
function createRouter() {
  const routerHistory = createMemoryHistory();
  return createRouter$1({
    history: routerHistory,
    routes: [
      {
        path: "/",
        name: "home",
        component: () => import("./assets/Home-7143db49.js")
      },
      {
        path: "/about",
        name: "about",
        component: () => import("./assets/About-3678cd6b.js")
      }
    ]
  });
}
function createApp() {
  const app = createSSRApp(App);
  const router = createRouter();
  app.use(router);
  return {
    app,
    router
  };
}
async function render(url, manifest) {
  const { app, router } = createApp();
  try {
    await router.push(url);
    await router.isReady();
    const ctx = {};
    const html = await renderToString(app, ctx);
    const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
    return [html, preloadLinks];
  } catch (error) {
    console.log(error);
  }
}
function renderPreloadLinks(modules, manifest) {
  let links = "";
  const seen = /* @__PURE__ */ new Set();
  modules.forEach((id) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}
function renderPreloadLink(file) {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    return "";
  }
}
export {
  _export_sfc as _,
  render
};
