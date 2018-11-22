## ES5
  - [es5语言规范](http://yanhaijing.com/es5/#null)
  - [You Dont Know JS](https://github.com/getify/You-Dont-Know-JS/tree/1ed-zh-CN)
  - [JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)

## 执行上下文栈
- 先进后出

## 执行上下文的创建

- ### 创建阶段
  - 确定this(this 是在函数执行的时候才确定下来的)
  - 词法环境创建
    - #### 组成
      + 环境记录：储存变量和函数声明的位置
      + 对外部环境的引用：可以访问其外部词法环境
    - #### 类型
      + 全局环境
      + 函数环境
  - 变量环境创建：变量环境也是一个词法环境，因此它具有上面定义的词法环境的所有属性。在 ES6 中，词法 环境和 变量 环境的区别在于前者用于存储函数声明和变量（ let 和 const ）绑定，而后者仅用于存储变量（ var ）绑定。
  
> tip:**变量提升**的原因：在创建阶段，函数声明存储在环境中，而变量会被设置为 undefined（在 var 的情况下）或保持未初始化（在 let 和 const 的情况下）。所以这就是为什么可以在声明之前访问 var 定义的变量（尽管是 undefined ），但如果在声明之前访问 let 和 const 定义的变量就会提示引用错误的原因。这就是所谓的变量提升。

- ### 执行阶段
