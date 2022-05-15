
# mini-program router
[English](https://github.com/Ke-Kou/mini-program-router-plus/blob/main/README.CN.md) | 简体中文

一款功能强大的小程序路由控制器
- promise的调用方式
- 使用goto方法来代替原来的navigateTo和switchTab方法
- 完善的A/B通讯功能
- 统一的路由守卫机制
- 路由栈超过限制时的智能控制
- 支持路由传递复杂参数
- 多平台支持

## 安装
### NPM
```
$ npm i mini-program-router-plus
```
### YARN
```
$ yarn add mini-program-router-plus
```

## 使用

### 引入
CommonJS
```js
const {initRouter} = require("mini-program-router-plus");
```

### 初始化配置
```js
const {initRouter} = require("mini-program-router-plus");

// 你可以将返回对象挂载在任意的全局对象上
wx.$router = initRouter({
    navigator: wx, // navigator是用于提供原生跳转方法 
    routes: [ // 具体页面信息
        {
            route: '/pages/index/index',
            isTab: true,
        },
        {
            route: '/pages/logs/logs',
            beforeEnter: (to, from, next) => {next()}
        }
    ],
    maxStack: 10, // 最大的路由栈,默认是10
    beforeEach: (to, from, next) => {next()}, // 前置路由守卫
    afterEach: (to, from) => {} // 后置路由
});
```

### 跳转
#### goto
- goto方法会判断对应的页面是否是tab页或者是normal页来执行对应的跳转方法
- 当整个路由栈超过最大路由栈时,如果对应的页面存在时,会返回到对应页面
- 接受promise的形式回调
```js
wx.$router.goto('/pages/index/index', option).then((res) => {
    console.log('success')
});
```
#### switchTab
```js
wx.$router.switchTab('/pages/index/index', option);
```
#### reLaunch
```js
wx.$router.reLaunch('/pages/index/index', option);
```
#### redirectTo
```js
wx.$router.redirectTo('/pages/index/index', option);
```
#### navigateTo
```js
wx.$router.navigateTo('/pages/index/index', option);
```
#### navigateBack
```js
wx.$router.navigateBack(option);
```
#### option参数
```ts
interface option {
    url?: string; // 路径,会替换前面参数的路径 
    delta?: number; // navigateBack参数 
    success?: Function; // 成功事件回调
    fail?: Function; // 失败事件回调
    complete?: Function; // 结束回调
    query?: Record<string, string|number>; // 携带在链接上的参数
    params?: Record<string, any>; // 存放在内存中的参数
    events?: Function; // 监听事件
}
```
#### 别名跳转
通过在routes配置文件增加name字段,可以通过别名方式跳转
```ts
wx.$router = initRouter({
    navigator: wx, // navigator是用于提供原生跳转方法 
    routes: [ // 具体页面信息
        {
            route: '/pages/user/user',
            name: 'user'
        },
        {
            route: '/pages/logs/logs',
            name: 'logs'
        }
    ],
});

wx.$router.goto('user') // 等于wx.$router.goto('/pages/user/user',)
```

### 路由守卫
<span style="color: #fff">注意:</span>路由守卫无法拦截到第一进入的情况,因此建议有一个类似开屏页面的落地页
#### 全局路由守卫
在初始化配置传入beforeEach钩子函数,钩子函数接受三个参数
- to: 待跳转的页面
- from: 当前执行跳转的页面
- next: 执行下一个操作
```js
initRouter({
    beforeEach: (to, from, next) => {
        next();
    }, // 前置路由钩子
    afterEach: (to, from) => {} // 后置路由钩子
});
```

##### next可以接受布尔值参数或者是字符串
```js
next(); // 表示执行跳转
next(false); // false表示拦截跳转, true表示执行跳转
next('/pages/home/home') // 表示跳转到/pages/home/home页面
```
#### 局部路由守卫
在routes数组参数中配置beforeEnter属性,参数属性和全局路由守卫一致
```js
{
    routes: [
        {
            route: '/pages/logs/logs',
            beforeEnter: (to, from, next) => {next()}
        }
    ]
}
```

### A/B通讯
目前A/B通讯, B页面只接受上一个路由栈传入事件
```js
// 添加监听事件
wx.$router.goto('B', {
    events: {
        [eventName]: (data, next) => {
            // 下面是B -> A
            console.log(data); // B 页面传递的数据
            next('A event'); // 执行B页面$emit方法then中的事件
        }
    } 
})
// 执行监听事件
wx.$router.emit(eventName, 'B event').then(
    res => {
        // A页面中监听事件next方法触发 
        console.log(res)
    }
)
```

### 传递/接收参数
- 原来的路由参数传递会序列化导致一些参数格式错误
- 现在可以通过params参数传递复杂参数
```js
// 传递参数
wx.$router.goto('/pages/logs/logs', {
    query: {
        name: 'k.k',
        age: 12,
    },
    params: {
        say: () => {console.log('hello world')},
        city: ['china', 'US']
    }
})
// 接收参数
const {getCurrentInstanceParams} = require('mini-program-router-plus');
const {query, params} = getCurrentInstanceParams();
// 或者
const {query, params} = wx.$router.getCurrentInstanceParams();
```

## 感谢
[JerryC 微信小程序路由实战](https://segmentfault.com/a/1190000039682661)
