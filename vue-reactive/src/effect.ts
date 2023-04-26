import type { Dep } from './dep'
import { createDep } from './dep'
type KeyToDepMap = Map<any, Dep>
export const extend = Object.assign
export type EffectScheduler = (...args: any[]) => any
export interface ReactiveEffectOptions {
  scheduler?: EffectScheduler,
  lazy?: boolean
}
// 存储副作用的容器
const targetMap = new WeakMap<any, KeyToDepMap>()
export let activeEffect: ReactiveEffect | undefined
export class ReactiveEffect<T = any>{
  deps: Dep[] = []
  parent: ReactiveEffect | undefined = undefined
  constructor(public fn: () => T, public scheduler: EffectScheduler | null = null,) { }
  run() {
    // 解决无限递归问题,例如以下代码
    // const obj = reactive({
    //   num: 1,
    // })
    // effect(() => {
    // obj.num = obj.num + 1
    // })
    let parent: ReactiveEffect | undefined = activeEffect
    while (parent) {
      // 如果当前执行的副作用函数更底层的副作用函数与当前执行的函数相同，则不执行，从而打断无限递归循环
      if (parent === this)
        return
      // 结合effect栈，追溯当前执行的副作用函数更底层的副作用函数
      parent = parent.parent
    }
    // 处理effect嵌套问题
    try {
      this.parent = activeEffect
      activeEffect = this!

      cleanupEffect(this)

      return this.fn()
    }
    finally {
      activeEffect = this.parent
      this.parent = undefined
    }
  }
}
// 每次清空
function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++)
      deps[i].delete(effect)

    deps.length = 0
  }
}

// 用于注册副作用函数
export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  // debugger
  const _effect = new ReactiveEffect(fn)
  if (options) extend(_effect, options)
  _effect.run()
}

export function track(target: object, key: unknown) {
  if (!activeEffect)
    return
  // 根据target从桶中获取depsMap, 它也是一个Map类型：key -> effects
  let depsMap = targetMap.get(target)
  // 如果不存在depsMap，则新建一个Map与target关联
  if (!depsMap)
    targetMap.set(target, (depsMap = new Map()))
  // 再根据key从depsMap中取得deps，它是一个Set类型
  // 用于存储当前key关联的副作用函数effects
  let dep = depsMap.get(key as string)
  // 如果不存在就新建一个Set与key关联
  if (!dep)
    depsMap.set(key as string, (dep = createDep()))
  // 将当前激活的副作用函数收集到桶中
  trackEffects(dep)
}
export function trackEffects(dep: Dep) {
  // 将当前激活的副作用函数收集到桶中
  dep.add(activeEffect!)
  // dep就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到activeEffect.deps数组中
  activeEffect!.deps.push(dep)
}
export function trigger(target: object, key: unknown) {
  // 根据target从桶中获取depsMap
  const depsMap = targetMap.get(target)
  if (!depsMap)
    return
  // 根据key获取所有的副作用函数
  const deps = depsMap.get(key as string)
  const effects: ReactiveEffect[] = []
  deps?.forEach((dep) => {
    if (dep) {
      effects.push(dep)
    }
  })
  // 执行副作用函数
  effects.forEach(effect => triggerEffect(effect))
}
export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}


