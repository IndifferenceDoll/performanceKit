# 使用说明
## npm 安装
npm install performancekit --save
## 方法说明
import performancekit from 'performancekit';

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

import performancekit from 'performancekit';

const { onloadPerformance } = performancekit;

onloadPerformance().then((obj) => {

  console.log('onloadPerformance', obj);

});

打印结果：

![log](./asset/log.jpg ''log'')