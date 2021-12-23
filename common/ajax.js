//创建xhr对象
function creatXMLObject(){
     return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');  //ie兼容性处理
}
//参数处理
function formatParams(data) {
    let dataStr = '';
    for (let item in data) {
        dataStr += ( dataStr ? "&" : "") + item + '=' + data[item]
    }
    return dataStr
}
//请求处理
function sendHandle(opts,xhr){
    const {type,url,async,delay} = opts
    const params = formatParams(opts.data)
    let reqUrl = url
    if(type == "get"){
        url += ('?' + params)
    }
    xhr.open(type,url,async)  //初始化 HTTP 请求参数
    if(type == "post"){ 
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    }
    //延时设置
    if(delay > 0){
        setTimeout(function(){
            xhr.send(type == "get" ? null : params) //发送请
        },delay)
    }else{
        xhr.send(type == "get" ? null : params) //发送请求
    }
    
}
function ajax(options){
    const xhr = creatXMLObject();
    const opts = {
        type:options.type.toLowerCase() || "get",
        url:options.url || '',
        data:options.data || null,
        async:options.async || true,
        timeout:options.timeout||0,
        delay:options.delay || 0,
        success:options.success,
        error:options.error
    }
    sendHandle(opts,xhr)
    //超时设置
    let isTimeout = false; //超时标记   
    const timer = setTimeout(function(){
        isTimeout = true;
         xhr.abort();  //取消请求
    },opts.timeout);
    //监听
    xhr.onreadystatechange = function(){
       //超时处理
        if(isTimeout){return}
        clearTimeout(timer)
       //延迟请求
        if(xhr.readyState === 4){  //HTTP响应全部接收
            if(xhr.status>=200 && xhr.status<=400){
                let resText = JSON.parse(xhr.responseText)
               opts.success(resText)
            }else{
               opts.error('失败!')
            }
        }
    }
}