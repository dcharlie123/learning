import { ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "../entry-server.js";
import "vue-router";
import "node:path";
const _imports_0 = "/assets/1-6296c0a1.png";
const Home_vue_vue_type_style_index_0_scoped_ee137678_lang = "";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<!--[--><img${ssrRenderAttr("src", _imports_0)} alt="" data-v-ee137678><div data-v-ee137678>Home</div><!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/Home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-ee137678"]]);
export {
  Home as default
};
