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
前端缓存：在从 memory cache 获取缓存内容时，浏览器会忽视例如 max-age=0, no-cache 等头部配置。如果不想让浏览器从memory cache中获取缓存，那就需要使用 no-store。
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
