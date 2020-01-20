# 使用说明
## npm 安装
npm install performance-kits --save
## 方法说明
需要在浏览器环境下

需要支持promise

需要支持performance，且支持performance timeline level2 规范

import performancekit from 'performance-kits';

const { onloadPerformance, switchPerformance, closePerformance } = performancekit;

其中，onloadPerformance用于检测页面onload后各项时间指标，所以要在项目入口文件就引入，不用担心会覆盖项目原有onload的回调，已做过兼容

switchPerformance用于路由切换时使用，需要开发者在监听路由变化的回调中使用。

closePerformance用于离开组件/关闭项目时使用，需要开发者在监听离开或关闭的回调中使用，需友情提示，如果是在关闭项目的回调中使用，那么通过接口上报数据的时候，通信方式请选择sendBeacon。

三个函数均只接受两个参数：

参数一：定时器间隔时间

参数二：总轮询时间

该轮询目的为找到paint类型的entry(需要浏览器兼容支持)，进而进行关于渲染的性能监测
## 项目中使用
index.js下：

import performancekit from 'performance-kits';

const { onloadPerformance } = performancekit;

onloadPerformance().then((obj) => {

  console.log('onloadPerformance', obj);

});

打印结果：

![log](https://github.com/IndifferenceDoll/performanceKit/raw/master/asset/log.jpg)

## PS
如果监测中出现负值和意外的不准确的结果，可能意味着在页面加载结束前进行了结果的获取，请调大总轮询时间，重新监测。

onloadPerformance默认总轮询时间5000ms

switchPerformance默认总轮询时间1000ms

closePerformance默认总轮询时间0ms

定时器间隔时间：默认为100ms