import { ReactiveEffect,track,trigger } from './effect'
export type ComputedGetter<T> = (...args: any[]) => T
export interface ComputedRef<T = any> {
  readonly value: T
}
export class ComputedRefTmpl<T>{
  public readonly effect: ReactiveEffect
  private _value!:T
  public _dirty = true
  constructor(getter: ComputedGetter<T>) {
    this.effect = new ReactiveEffect(getter,()=>{
      if(!this._dirty){
        this._dirty=true
        trigger(this,'value')
      }
    })
  }
  get value() {
    if(this._dirty){
      this._dirty=false
      this._value=this.effect.run()
    }
    track(this,'value')
    return this._value
  }
}
export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T> {
  debugger
  const cRef = new ComputedRefTmpl(getter)
  return cRef as any
}