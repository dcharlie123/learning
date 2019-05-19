# learning_resource
整理一些在线的学习资源
- js
- css3
- html5
- R语言
- PHP
- Python
- kotlin
### 3-20
http:http://www.52im.net/thread-1095-1-1.html

### 3-21
#### 前端缓存：

https://mp.weixin.qq.com/s/cUqkG3NETmJbglDXfSf0tg

https://mp.weixin.qq.com/s/y-yajw1GaWLKUdOJo3cbew

按缓存位置分类:
- Service Worker
- Memory Cache
- Disk Cache
- 网络请求

1. **在从 memory cache 获取缓存内容时，浏览器会忽视例如 max-age=0, no-cache 等头部配置。如果不想让浏览器从memory cache中获取缓存，那就需要使用 no-store。**
2. **根据 HTTP 头部的相关字段(Cache-control, Pragma 等)决定是否存入 disk cache**
3. **memory cache 是浏览器为了加快读取缓存速度而进行的自身的优化行为，不受开发者控制，也不受 HTTP 协议头的约束，算是一个黑盒。**
4. no-cache 从语义上表示下次请求不要直接使用缓存而需要比对，并不对本次请求进行限制。
>浏览器的行为
所谓浏览器的行为，指的就是用户在浏览器如何操作时，会触发怎样的缓存策略。主要有 3 种：
打开网页，地址栏输入地址： 查找 disk cache 中是否有匹配。如有则使用；如没有则发送网络请求。
普通刷新 (F5)：因为 TAB 并没有关闭，因此 memory cache 是可用的，会被优先使用(如果匹配的话)。其次才是 disk cache。
强制刷新 (Ctrl + F5)：浏览器不使用缓存，因此发送的请求头部均带有 Cache-control: no-cache(为了兼容，还带了 Pragma: no-cache)。服务器直接返回 200 和最新内容。
5. 注意：no-cache并不意味着不缓存，而是使用缓存前必须请求服务端进行检查(或者说叫重新校验)。no-store告诉浏览器，根本不要缓存这个文件。同时，must-revalidate也不是说就『must-revalidate』，而是如果本地资源的缓存时间还没有超过设置的max-age的值，就可以直接使用本地资源，否则必须重新校验。
### 3-23
前端移动端调试:https://juejin.im/entry/5c947f85f265da612d633e95

eruda:https://www.imooc.com/article/20870

spy-debugger：
- 安装
```
npm i -g spy-debugger
```
- 启动
```
spy-debugger
```
  - 设置手机
 设置方式与抓包工具相同
代理的地址为 PC的IP地址 ，代理的端口为spy-debugger的启动端口(默认端口为：9888)默认端口是 9888。
如果要指定端口: spy-debugger –p 8888
  - 安装证书
手机安装证书(node-mitmproxy CA根证书)

第一步：生成证书：

生成CA根证书，根证书生成在 /Users/XXX/node-mitmproxy/ 目录下(Mac)。
```
spy-debugger initCA
```
第二步：安装证书：
把node-mitmproxy文件夹下的 node-mitmproxy.ca.crt 传到手机上，点击安装即可。
Spy-debugger启动界面，同样，在手机端刷新页面之后，targets中会有记录

### 3-31
- 理解闭包
一种柯里化的方法：
```javascript
function currying(fn){
  let max_length=fn.length,args_arr=[];
  let closure=function(...args){
    args_arr=args_arr.concat(args);
    if(args_arr.length<max_length) return closure;//如果传入参数还未达到要求进行返回
    return fn(...args_arr);
  }
  return closure
} 
```

- 对称布局：direction:ltr
  - ltr	默认。文本方向从左到右。
  - rtl	文本方向从右到左。
  - inherit	规定应该从父元素继承 direction 属性的值。

- 小程序wxs：可以用于编写wxml过滤器

- new的模拟实现
```javascript
function create(){
  var obj=new Object();
  Con=[].shift.call(arguments);//取出第一个，获得构造函数
  obj.__proto__=Con.prototype;
  var ret=Con.apply(pbj,arguments);
  return typeof ret === 'object'?ret:obj;//如果返回的是对象优先返回构造函数返回的对象
}
```
## 4-2
 - 窗体的滚动高度获取:var winScrollTop = window.pageYOffset || document.documentElement.scrollTop;
 - 浏览器窗体高度获取:var winHeight = window.innerHeight || document.documentElement.clientHeight;
 - 小程序长列表setData优化
```javascript
onReachBottom(){
  let index=this.data.listData.length;
  let newData={};
  [11,12,13,14,15,16].forEach((item)=>{
    newData['listData['+(index++)+']']=item;
  })
  console.log(newData);
  this.setData(newData)
}
```
## 4-1
- 原生ajax
```javascript
var xhr=new XMLHttpRequest();
xhr.open('post','www.xxx.com',true);
xhr.onreadystatechange=function(){
  if(xhr.readyState===4){
    if(xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
        console.log(xhr.responseText);
    }
  }
}
postData={"name1":"xxx","name2":"yyy"};
postData=(function(value){
    var dataString = "";
    for(var key in value){
       dataString += key+"="+value[key]+"&";
    };
    return dataString;
}(postData));
// 设置请求头
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
// 异常处理
xhr.onerror = function() {
   console.log('Network request failed')
}
// 跨域携带 cookie
xhr.withCredentials = true;
// 发出请求
xhr.send(postData);
```
- withCredentials

ajax请求默认会携带同源请求的cookie，而跨域请求则不会携带cookie，设置xhr的withCredentials的属性为true将允许携带跨域cookie。

## 4-11
- [defer和async的区别](https://segmentfault.com/q/1010000000640869)

## 4-18
- nginx前端（参考：[前端想要了解的Nginx](https://juejin.im/post/5cae9de95188251ae2324ec3);[前端必备！最全nginx技术分析](https://mp.weixin.qq.com/s/wecUdGnuHdZOs3t7zc16jw)）
  - 基础：1.启动`start nginx`；2.快速停止或关闭`nginx -s stop`;3.正常停止关闭`nginx -s quit`;4.`nginx -t`看是否有错误;5.`nginx -s reload` 更新Nginx配置文件
  - 静态主机：
    - server 配置虚拟主机的相关参数，可以有多个
    - server_name 通过请求中的host值 找到对应的虚拟主机的配置
    - location 配置请求路由，处理相关页面情况
    - root 查找资源的路径
  - 动态匹配
    - = 表示精确匹配。只有请求的url路径与后面的字符串完全相等时，才会命中（优先级最高）。
    - ^~ 表示如果该符号后面的字符是最佳匹配，采用该规则，不再进行后续的查找。
    - ~ 表示该规则是使用正则定义的，区分大小写。
    - ~* 表示该规则是使用正则定义的，不区分大小写。
```
  location ~* \.(js|css|png|jpg|gif)$ {
    add_header Cache-Control no-store;
  }
```
  - 反向代理解决跨域
    - 拦截路径/api, 可以通过正则匹配。
    - proxy_set_header 允许重新定义或添加字段传递给代理服务器的请求头。
    - $http_host、$remote_addr、$scheme 为Nginx内置变量。
    - rewrite 根据rewrite后的请求URI，将路径重写，如：接口路径为 /user, 我们可以请求 /api/user。（为什么需要重写uri？因为在使用Nginx做反向代理的时候，需要匹配到跨域的接口再做转发，为了方便匹配，会人为的在原接口中添加一段路径（或标示， 如例子中的api），因此需要在匹配之后、转发之前把添加的那段去掉，因此需要rewrite。）
    - break 继续本次请求后面的处理 ,停止匹配下面的location。需要注意的是与之类似的last执行过程则是停止当前这个请求，并根据rewrite匹配的规则重新发起一个请求，从上到下依次匹配location后面的规则。
    - proxy_pass 代理服务器。
  ```
  location /api {   
    # 请求host传给后端
    proxy_set_header Host $http_host;
    # 请求ip 传给后端
    proxy_set_header X-Real-IP $remote_addr;
    # 请求协议传给后端
    proxy_set_header X-Scheme $scheme;
    # 路径重写
    rewrite  /api/(.*)  /$1  break;
    # 代理服务器
    proxy_pass http://localhost:9000;
  }
  ```
  - 配置gzip
  ```
  server {
    # 开启gzip 压缩
    gzip on;
    # 设置gzip所需的http协议最低版本 （HTTP/1.1, HTTP/1.0）
    gzip_http_version 1.1;
    # 设置压缩级别，压缩级别越高压缩时间越长  （1-9）
    gzip_comp_level 4;
    # 设置压缩的最小字节数， 页面Content-Length获取
    gzip_min_length 1000;
    # 设置压缩文件的类型  （text/html)
    gzip_types text/plain application/javascript text/css;
  }
  ```
  - 负载均衡
 
 ### 5.8
 - 解决图片防盗链 [link](https://www.cnblogs.com/awzf/p/9811386.html)
