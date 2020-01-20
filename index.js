/* eslint-disable*/
export default (function(){const ONLOAD = 'ONLOAD';
    const CLOSE = 'CLOSE';
    const SWITCH = 'SWITCH';

    const typeMap = {
        0: 'TYPE_NAVIGATE  ，点击链接、地址栏输入、表单提交、脚本操作等。',
        1: 'TYPE_RELOAD  ，点击重新加载按钮、location.reload。',
        2: 'TYPE_BACK_FORWARD，点击前进或后退按钮。',
        255: 'TYPE_RESERVED，任何其他来源。即非刷新/非前进后退、非点击链接/地址栏输入/表单提交/脚本操作等。'
    }

    //判断参数是否为函数
    const isFunc = (func) => {
        return typeof func === 'function';
    }

    //校验当前环境是否支持工具使用
    const validateUseful = () => {
        try {
            if(!window) {
                throw new Error('请在浏览器环境下使用');
            }
            const itIsPromse = isFunc(window.Promise);
            if(!itIsPromse){
                throw new Error('不支持Promise');
            }
            if(!window.performance) {
                throw new Error('不支持performance');
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 生成
    const createResultItem = (value = '', info = '') => {
        if(!value && value !== 0) return {};
        return {
            value,
            info,
        }
    }

    //获取除paint外的性能信息
    const getExceptPaintInfo = () => {
        const resultObj = {};
        resultObj.nativePerformance = createResultItem(window.performance, 'performance的原生对象');
        const { timeOrigin = 0, navigation = {} } = window.performance;
        resultObj.monitorStartTimePoint = createResultItem(timeOrigin, '性能监测开始的时间');
        const { type = '', redirectCount = 0 } = navigation;
        resultObj.redirectCount = createResultItem(redirectCount, '页面被重定向的次数');
        resultObj.type = createResultItem(type, typeMap[type]);
        const newNavigation = window.performance.getEntriesByType('navigation')[0];
        const {
            nextHopProtocol = '', name = '',
            redirectStart = 0, redirectEnd = 0,
            domainLookupStart = 0, domainLookupEnd = 0,
            fetchStart = 0,
            connectStart = 0, connectEnd = 0, secureConnectionStart = 0,
            requestStart = 0, responseStart = 0, responseEnd = 0,
            unloadEventStart = 0, unloadEventEnd = 0,
            domInteractive = 0, domComplete = 0,
            domContentLoadedEventStart = 0, domContentLoadedEventEnd = 0,
            serverTiming = [],
            loadEventStart = 0, loadEventEnd = 0,

            workerStart = 0, // workerServie开始分配工作的时间
             transferSize = 0, // 表示所取出资源的大小(包含响应头和响应体，若是缓存或跨域，则为0)
             encodedBodySize = 0, // 表示所取出资源编码时的大小(只包含响应体)
             decodedBodySize = 0, // 表示所取出资源解码后的大小(只包含响应体)
        } = newNavigation;

        resultObj.nextHopProtocol = createResultItem(nextHopProtocol, '当前请求使用协议');
        resultObj.address = createResultItem(name, '当前请求使地址');
        resultObj.workerStartTime = createResultItem(workerStart, 'workerServie开始分配工作的时间');
        resultObj.transferSize = createResultItem(transferSize, '表示所取出资源的大小(包含响应头和响应体，若是缓存或跨域，则为0)');
        resultObj.encodedBodySize = createResultItem(encodedBodySize, '表示所取出资源编码时的大小(只包含响应体)');
        resultObj.decodedBodySize = createResultItem(decodedBodySize, '表示所取出资源解码后的大小(只包含响应体)');
        resultObj.redirectTime = createResultItem(redirectEnd - redirectStart, '重定向花费时间');
        resultObj.dnsTime = createResultItem(domainLookupEnd - domainLookupStart, 'dns解析查询花费时间');
        resultObj.TTFBByReal = createResultItem(responseStart - domainLookupStart, '真实的TTFB时间(包含域名解析、tcp链接、请求发起到响应)');
        resultObj.TTFBByNetwork = createResultItem(responseStart - requestStart, 'network中请求的Wait(TTFB)时间(只包含域请求发起到响应)');
        resultObj.appcacheTime = createResultItem(domainLookupStart - fetchStart, '应用读取缓存花费时间');
        resultObj.unloadTime = createResultItem(unloadEventEnd - unloadEventStart, '当前页面/路由组件卸载花费时间');
        resultObj.tcpTime = createResultItem(connectEnd - connectStart, 'tcp链接花费时间');
        resultObj.secureTcpTime = createResultItem(secureConnectionStart ? connectEnd - secureConnectionStart : 0, 'https安全链接(ssl)握手花费时间');
        resultObj.resposeTime = createResultItem(responseEnd - responseStart, '请求成功后下载响应数据花费时间');
        resultObj.analysisDomTime = createResultItem(domComplete - domInteractive, '单页面客户端渲染下，为解析模板dom树所花费时间；非单页面或单页面服务端渲染下，为解析实际dom树所花费时间');
        resultObj.domReadyTime = createResultItem(domContentLoadedEventEnd - fetchStart, '单页面客户端渲染下，为生成模板dom树所花费时间；非单页面或单页面服务端渲染下，为生成实际dom树所花费时间');
        resultObj.domContentLoadEventTime = createResultItem(domContentLoadedEventEnd - domContentLoadedEventStart, 'onDomContentLoad事件执行花费的时间');
        resultObj.serverTiming = createResultItem(serverTiming, '一个请求内，服务器在响应过程中，各步骤耗时指标。由后端设置于reponse header中，受跨域限制');
        resultObj.LoadEventTime = createResultItem(loadEventEnd - loadEventStart, 'onLoad事件执行花费的时间');
        resultObj.pageLoadTime = createResultItem(loadEventEnd - fetchStart, '单页面客户端渲染下，模板页面加载(用户等待)所花费时间；非单页面或单页面服务端渲染下，为实际页面加载(用户等待)花费时间');
        resultObj.startRender = createResultItem(domContentLoadedEventStart - domainLookupStart, 'TTFB(发起请求到服务器返回数据的时间) + TTDD(从服务器加载HTML文档的时间) + TTHE(HTML文档头部解析完成所需要的时间)');
        return resultObj;
    }

    //获取paint性能信息
    const getPaintInfo = () => {
        const resultObj = {};
        const newNavigation = window.performance.getEntriesByType('navigation')[0];
        const { fetchStart = 0, } = newNavigation;
        const firstPaint = window.performance.getEntriesByType('paint')[0];
        const { startTime: firstPaintTime = 0 } = firstPaint;
        resultObj.firstPaintTime = createResultItem(firstPaintTime - fetchStart, '首次渲染时间(第⼀个非网页背景像素渲染)');
        const firstContentPaint = window.performance.getEntriesByType('paint')[1];
        const { startTime: firstContentPaintTime = 0 } = firstContentPaint;
        resultObj.firstContentPaintTime = createResultItem(firstContentPaintTime - fetchStart, '首次内容渲染时间(第一个 ⽂本、图像、背景图片或非白色 canvas/SVG 内容渲染)');

        return resultObj;
    }

    //监测性能核心代码
    const performanceCore = (res = () => {}, everyPollingTime = 100, pollingTime = 1000, type = '') => {
        const currTime = window.performance.now();
        const polling = setInterval(() => {
            const everyTime = window.performance.now();
            const paintEntryArr = window.performance.getEntriesByType('paint');
            if(paintEntryArr.length > 0){
                clearInterval(polling);
                const exceptPaintInfo = getExceptPaintInfo();
                const paintInfo = getPaintInfo();
                const includePaintInfoObj = Object.assign({}, exceptPaintInfo, paintInfo, { msg:'包含paint相关信息!', type })
                res(includePaintInfoObj);
            } else if(everyTime - currTime > pollingTime){
                clearInterval(polling);
                const exceptPaintInfo = getExceptPaintInfo();
                const expectPaintInfoObj = Object.assign({}, exceptPaintInfo, { msg:'未包含paint相关信息(总轮询时间太短或不支持paint类型entry)!', type })
                res(expectPaintInfoObj);
            }
        }, everyPollingTime);
    }

    const switchPerformance = (everyPollingTime = 100, pollingTime = 1000) => {
        validateUseful();
        return new Promise((res = () => {}) => {
                performanceCore(res, everyPollingTime, pollingTime, SWITCH);
        });
    }

    const closePerformance = (everyPollingTime = 0, pollingTime = 0) => {
        validateUseful();
        return new Promise((res = () => {}) => {
                performanceCore(res, everyPollingTime, pollingTime, CLOSE);
        });
    }

    //页面初始化时监测性能
    const onloadPerformance = (everyPollingTime = 100, pollingTime = 5000) => {
        validateUseful();
        return new Promise((res = () => {}) => {
            const loadCallback = window.onload;
            const itIsCallBack = isFunc(loadCallback);
            const newLoadCallback = (e = {}) => {
                performanceCore(res, everyPollingTime, pollingTime, ONLOAD);
                if(itIsCallBack){
                    loadCallback(e);
                }
            }
            window.onload = newLoadCallback;
        });
    };
    return {
        switchPerformance,
        closePerformance,
        onloadPerformance,
    }
})();
// TODO:
// 增加node服务端的performance监控=》需自动检测环境
// 转换为类写法
// 代码压缩