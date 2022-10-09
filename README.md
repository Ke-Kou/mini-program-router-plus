
# mini-program router
English | [简体中文](https://github.com/Ke-Kou/mini-program-router-plus/blob/main/README.CN.md)

A powerful miniProgram-routing controller
- Use promise callback
- Use the goto method to replace the original navigateTo and switchTab methods
- A Perfect A/B communication function
- A routing guard
- A routing stack controller
- Support query and params
- Support Multi-platform

## Install
### NPM
```
$ npm i mini-program-router-plus
```
### YARN
```
$ yarn add mini-program-router-plus
```

## Use

### import&require
```js
// commonjs
const {initRouter} = require("mini-program-router-plus");
// ESM
import {initRouter} from "mini-program-router-plus";
```

### initialize
```js
const {initRouter} = require("mini-program-router-plus");

// You can mount the returned object on any global object
wx.$router = initRouter({
    navigator: wx, // An object that provides native jump methods
    routes: [ // route config 
        {
            route: '/pages/index/index',
            isTab: true,
        },
        {
            route: '/pages/logs/logs',
            beforeEnter: (to, from, next) => {next()}
        }
    ],
    maxStack: 10, // The maximum number of routing stacks, default 10
    beforeEach: (to, from, next) => {
        next() // you need call this function to next page;
    }, // Pre-Route Guard
    afterEach: (to, from) => {} // After-Route
});
```

### use in typescript
you need add global.d.ts in file root, there are an example:
```ts
// in Taro
declare module '@tarojs/taro' {
  import Router from "mini-program-router-plus/dist/router";

  let $$router: Router;
}
// you can use
Taro.$$router.goto('/path');
```

### Api
#### goto
- The goto method will determine whether the corresponding page is a tab page or a normal page to execute the corresponding jump method
- When the entire routing stack exceeds the maximum routing stack, if the corresponding page exists, it will return to the corresponding page
- Callbacks that accept promises
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
#### option
```ts
interface option {
    url?: string; // path, which will replace the path of the previous parameter
    delta?: number; // the param of navigateBack 
    success?: Function; // success callback
    fail?: Function; // fail callback 
    complete?: Function; // finish callback
    query?: Record<string, string|number>; // it will combined with path
    params?: Record<string, any>; // it only save in memory
    events?: Function; // some listener
}
```
#### Alias Jump
by adding the __name__ to the routes-config, you can jump through aliases
```ts
wx.$router = initRouter({
    navigator: wx,
    routes: [
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

wx.$router.goto('user') // equal wx.$router.goto('/pages/user/user',)
```

### Route Guard
<span style="color: #fff">Notice:</span>The routing guard cannot intercept the first entry, so it is recommended to have a landing page similar to the opening page
#### global routing guard
Pass in the beforeEach hook function in the initialization configuration, the hook function accepts three parameters
- to: page to jump to
- from: The page to which the jump is currently performed
- next: run jump
```js
initRouter({
    beforeEach: (to, from, next) => {
        next();
    },
    afterEach: (to, from) => {}
});
```

##### next can accept a boolean parameter or a string
```js
next(); // successful jump
next(false); // false is not jump, true is go next;
next('/pages/home/home') // jump to anthor page; 
```
#### local route guard
Configure the beforeEnter property in the routes array parameter, the parameter property is consistent with the global route guard
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

### A / B
```js
// Add listener event
wx.$router.goto('B', {
    events: {
        [eventName]: (data, next) => {
            console.log(data); // B event data
            next('A event'); // Execute the event in the $emit method then of page B
        }
    } 
})
// Execute the listener event
wx.$router.emit(eventName, 'B event').then(
    res => {
        // a next called from A page
        console.log(res)
    }
)
```

### Pass/Receive Parameters
- The original router transfer will serialize and cause some parameter format errors
- Complex parameters can now be passed through the params parameter
```js
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
// query {name, age}
// params {say, city}
const {getCurrentInstanceParams} = require('mini-program-router-plus');
const {query, params} = getCurrentInstanceParams();
// or
const {query, params} = wx.$router.getCurrentInstanceParams();
```

## Thanks
[JerryC](https://segmentfault.com/a/1190000039682661)
