const tick = Promise.resolve()
// 自定义一个任务队列
const queue:any[]=[]
// 标志是否正在刷新队列
let queued=false
const flush = ()=>{
  for(let i = 0;i<queue.length;i++){
    queue[i]()
  }
  queue.length = 0 
  queued = false
}
export const scheduler = (fn:any) => {
  if(!queue.includes(fn)){
    queue.push(fn)
    if(!queued){
      queued = true
      tick.then(flush)
    }
  }
}