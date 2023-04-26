var Vue = (function (exports) {
  'use strict';

  var createDep = function (effects) {
      var dep = new Set(effects);
      return dep;
  };

  var extend = Object.assign;
  // 存储副作用的容器
  var targetMap = new WeakMap();
  var activeEffect;
  var ReactiveEffect = /** @class */ (function () {
      function ReactiveEffect(fn, scheduler) {
          if (scheduler === void 0) { scheduler = null; }
          this.fn = fn;
          this.scheduler = scheduler;
          this.deps = [];
          this.parent = undefined;
      }
      ReactiveEffect.prototype.run = function () {
          // 解决无限递归问题,例如以下代码
          // const obj = reactive({
          //   num: 1,
          // })
          // effect(() => {
          // obj.num = obj.num + 1
          // })
          var parent = activeEffect;
          while (parent) {
              // 如果当前执行的副作用函数更底层的副作用函数与当前执行的函数相同，则不执行，从而打断无限递归循环
              if (parent === this)
                  return;
              // 结合effect栈，追溯当前执行的副作用函数更底层的副作用函数
              parent = parent.parent;
          }
          // 处理effect嵌套问题
          try {
              this.parent = activeEffect;
              activeEffect = this;
              cleanupEffect(this);
              return this.fn();
          }
          finally {
              activeEffect = this.parent;
              this.parent = undefined;
          }
      };
      return ReactiveEffect;
  }());
  // 每次清空
  function cleanupEffect(effect) {
      var deps = effect.deps;
      if (deps.length) {
          for (var i = 0; i < deps.length; i++)
              deps[i].delete(effect);
          deps.length = 0;
      }
  }
  // 用于注册副作用函数
  function effect(fn, options) {
      // debugger
      var _effect = new ReactiveEffect(fn);
      if (options)
          extend(_effect, options);
      _effect.run();
  }
  function track(target, key) {
      if (!activeEffect)
          return;
      // 根据target从桶中获取depsMap, 它也是一个Map类型：key -> effects
      var depsMap = targetMap.get(target);
      // 如果不存在depsMap，则新建一个Map与target关联
      if (!depsMap)
          targetMap.set(target, (depsMap = new Map()));
      // 再根据key从depsMap中取得deps，它是一个Set类型
      // 用于存储当前key关联的副作用函数effects
      var dep = depsMap.get(key);
      // 如果不存在就新建一个Set与key关联
      if (!dep)
          depsMap.set(key, (dep = createDep()));
      // 将当前激活的副作用函数收集到桶中
      trackEffects(dep);
  }
  function trackEffects(dep) {
      // 将当前激活的副作用函数收集到桶中
      dep.add(activeEffect);
      // dep就是一个与当前副作用函数存在联系的依赖集合
      // 将其添加到activeEffect.deps数组中
      activeEffect.deps.push(dep);
  }
  function trigger(target, key) {
      // 根据target从桶中获取depsMap
      var depsMap = targetMap.get(target);
      if (!depsMap)
          return;
      // 根据key获取所有的副作用函数
      var deps = depsMap.get(key);
      var effects = [];
      deps === null || deps === void 0 ? void 0 : deps.forEach(function (dep) {
          if (dep) {
              effects.push(dep);
          }
      });
      // 执行副作用函数
      effects.forEach(function (effect) { return triggerEffect(effect); });
  }
  function triggerEffect(effect) {
      if (effect.scheduler) {
          effect.scheduler();
      }
      else {
          effect.run();
      }
  }

  var get = createGetter();
  var set = createSetter();
  function createGetter() {
      return function get(target, key) {
          track(target, key);
          return target[key];
      };
  }
  function createSetter() {
      return function set(target, key, newValue) {
          target[key] = newValue;
          trigger(target, key);
          return true;
      };
  }
  var mutableHandlers = {
      get: get,
      set: set,
  };

  function reactive(target) {
      return new Proxy(target, mutableHandlers);
  }

  var ComputedRefTmpl = /** @class */ (function () {
      function ComputedRefTmpl(getter) {
          var _this = this;
          this._dirty = true;
          this.effect = new ReactiveEffect(getter, function () {
              if (!_this._dirty) {
                  _this._dirty = true;
                  trigger(_this, 'value');
              }
          });
      }
      Object.defineProperty(ComputedRefTmpl.prototype, "value", {
          get: function () {
              if (this._dirty) {
                  this._dirty = false;
                  this._value = this.effect.run();
              }
              track(this, 'value');
              return this._value;
          },
          enumerable: false,
          configurable: true
      });
      return ComputedRefTmpl;
  }());
  function computed(getter) {
      debugger;
      var cRef = new ComputedRefTmpl(getter);
      return cRef;
  }

  exports.computed = computed;
  exports.effect = effect;
  exports.reactive = reactive;

  return exports;

})({});
//# sourceMappingURL=vue.js.map
