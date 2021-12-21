//创建xhr对象
function creatXMLObject(){
     let xhr =  null;
     xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');  //ie兼容性处理
     return xhr
}
//参数处理
function formatData(data) {
    let dataStr = '';
    for (let item in data) {
        dataStr += ( dataStr ? "&" : "") + item + '=' + data[item]
    }
    return dataStr
}
//请求处理
function sendHandle(opts,params,xhr){
    const {type,url,async} = opts
    if(type == "get"){ url += "?" + param }
    xhr.open(type,url,async)  //初始化 HTTP 请求参数
    if(type == "post"){ xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")}
    xhr.send(type == "get" ? null : params) //发送请求
}
function ajax(options){
    const xhr = creatXMLObject();
    const opts = {
        type:options.type.toLowerCase() || "get",
        url:options.url || '',
        data:options.data || null,
        async:options.async || true,
        success:options.success,
        error:options.error
    }
    const params = formatData(opts.data)
    sendHandle(opts,params,xhr)
    //监听
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){  //HTTP响应全部接收
            if(xhr.status === 200){
                let resText = JSON.parse(xhr.responseText)
               opts.success(resText)
            }else{
               opts.error('失败!')
            }
        }
    }

}