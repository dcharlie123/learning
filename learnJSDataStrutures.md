## 栈
```javascript
function Stack(){
  let items=[];
  //入栈
  this.push=function(ele){
    items.push(ele);
  }
 //出栈
  this.pop=function(){
    return items.pop();
  }
  //查看栈顶元素
  this.peek=function(){
    return items[items.length-1];
  }
  //检查栈是否为空
  this.isEmpty=function(){
    return items.length==0;
  }
  this.size=function(){
    return items.length;
  }
  //清空栈
  this.clear=function(){
    items=[];
  }
  //打印栈元素
  this.print=function(){
    console.log(items.toString());
  }
}
```
### 栈的运用-十进制转二机制
```javascript
function divideBy2(decNumber){
  var remStack=new Stack(),
      rem,
      binaryString='';
  while(decNumber>0){
    rem=Math.floor(decNumber%2);
    remStack.push(rem);
    decNumber=Math.floor(decNumber/2);
  }
  while(!remStack.isEmpty()){
    binaryString+=remStack.pop().toString();
  }
  return binaryString;
}
```
### 还可以升级成十进制转其他进制
```javascript
  function baseConverter(decNumber,base){
    if(base>16){
      console.error("请输入正确的数");
      return;
    }
    var remStack=new Stack(),
        rem,
        baseString='',
        digits='0123456789ABCDEF';
      while(decNumber>0){
        rem=Math.floor(decNumber%base);
        remStack.push(rem);
        decNumber=Math.floor(decNumber/base);
      }
      while(!remStack.isEmpty()){
        baseString+=digits[remStack.pop()];
      }
      return baseString
  }
```
## 队列
```javascript
 function Queue(){
  let items=[];
  //向队列添加多个元素
  this.enqueue=function(eles){
    items.push(eles)
  }
  //从队列移除元素
  this.dequeue=function(){
    return items.shift();
  }
  //查看队列头元素
  this.front=function(){
    return items[0];
  }
  //检查队列是否为空
  this.isEmpty=function(){
    return items.length==0;
  }
  this.size=function(){
    return items.length;
  }
  //打印队列元素
  this.print=function(){
    console.log(items.toString());
  }
 }
```
### es6版
```javascript
let Queue2=(function(){
  const items=new WeakMap();
  class Queue2{
    constructor(){
      items.set(this,[])
    }
    equeue(ele){
      let q=items.get(this);
      q.push(ele);
    }
    dequeue(){
      let q=items.get(this);
      let r=q.shift();
      return r;
    }
    front(){
      let q=items.get(this);
      return q[0]
    }
    isEmpty(){
      let q=items.get(this);
      return q.length==0;
    }
    size(){
      let q=items.get(this);
      return q.length
    }
    print(){
      console.log(items.get(this));
    }
  }
  return Queue2;
})();
```
### 优先队列
```javascript
function PriorityQueue(){
  
}
```



















