//创建xhr对象
function creatXMLObject(){
    return new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHttp');  //ie兼容性处理
}
/*
* 参数处理
* @param data 参数格式化
*/

function formatParams(data) {
   let dataStr = '';
   for (let item in data) {
       dataStr += ( dataStr ? "&" : "") + item + '=' + data[item]
   }
   return dataStr
}
/*
* 请求处理
* @param opts 参数配置
* @param xhr 对象
*/

function sendHandle(opts,xhr) {
   const {type, async, delay, header} = opts
   let { url } = opts;
   const params = opts.data !== null && formatParams(opts.data)
   if(type.toLowerCase() == "get") {
       url += ('?' + params)
   }
   xhr.open(type, url, async)  //初始化 HTTP 请求参数
   if(header) {
       setReqHeader(header,xhr)
   }
   if(type.toLowerCase() === "post") { 
       xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
   }
   //延时设置
   if(delay > 0){
       setTimeout(function() {
           xhr.send(type === "get" ? null : params) //发送请
       },delay)
   }else{
       xhr.send(type === "get" ? null : params) //发送请求
   }
   
}
/*
* 请求头设置
* @param headerOpts 参数配置
* @param xhr 对象
*/
function setReqHeader(headerOpts,xhr) {
   for(let item in headerOpts) {
       xhr.setRequestHeader(item,headerOpts[item])
   }
}
/*
* ajax
* @param opts  请求传参
*/
function ajax(opts) {
   const defaultOpts = {
       type: "get",
       url: '',
       data:null,
       async:true,
       timeout:null,
       delay:null,
       header:null,
       dataType:"json",
       jsonp:"callback",
       jsonpCallback:"",
       success:function(){},
       error:function(){}
   }
   opts = Object.assign(defaultOpts,opts)
   if(opts.dataType.toLowerCase() === 'jsonp') {
       jsonp(opts)
   }else {
       ajaxRequset(opts)
   }
}

/*
* get/post/put/delete 请求
* @param opts 请求传参
* @param xhr xhr
*/

function ajaxRequset(opts) {
    const xhr = creatXMLObject();
    //请求处理
    sendHandle(opts, xhr)
    //超时设置
    timeoutFun(opts, xhr)
    //监听
    xhr.onreadystatechange = function() {
        //超时处理
        if(options.timeoutBool) {return}
        clearTimeout(options.timeoutFlag)
        //延迟请求
        if(xhr.readyState === 4) {  //HTTP响应全部接收
            if(xhr.status >= 200 && xhr.status < 300) {
                let resText = xhr.responseText;
                try{
                    switch(opts.dataType.toLowerCase()){
                        case 'text':
                        case 'html':   
                            break;
                        case 'json':
                            resText = JSON.parse(resText);
                            break;
                        case 'XML':
                            resText = xhr.responseXML;
                    }
                }catch(e){
                    Console.log(e.message)
                }
                opts.success(resText)
            }else {
                opts.error(xhr.status)
            }
        }
    }
}

/*
* jsonp
* @param opts  请求传参
*/
function jsonp(opts) {
    if(!opts.url){
        throw new Error('参数不合法')
    }
    //创建script 标签并加入页面中
    //设置回调函数的名称
    const callbackName = opts.jsonpCallback || ('jsonp' + Math.round(Math.random()*1000000))
    const params = opts.data !== null && formatParams(opts.data)
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    head.appendChild(script)
    //创建jsonp 回调函数
     window[callbackName] = function(json) {
        head.removeChild(script)
        clearTimeout(options.timeoutFlag)
        window[callbackName] = null
        opts.success && opts.success(json);
     }
    //发送请求
    //延时设置
    if(opts.delay > 0) {
        setTimeout(function() {
            script.src = `${opts.url}?${params}&callback=${callbackName}`
        },opts.delay)
    }else {
        script.src = `${opts.url}?${params}&callback=${callbackName}`
    }
    //超时处理
    timeoutFun(opts, xhr, callback, script)
}
/*
* 超时参数设置
* @param timeoutFlag  超时标识
* @param timeoutBool  是否请求超时
*/

let options = {
    timeoutFlag: null, //超时标识
    timeoutBool: false //是否请求超时
}

/*
* 超时请求
* @param opts  请求传参
*/
function timeoutFun(opts, xhr, callback, script) {
    if (opts.timeout !== undefined) {
        options.timeoutFlag = setTimeout(function() {
            if (opts.dataType === "jsonp") {
                delete window[callback];
                document.body.removeChild(script);
            } else {
                options.timeoutBool = true;
                xhr && xhr.abort();
            }
        }, opts.timeout);
    }
}