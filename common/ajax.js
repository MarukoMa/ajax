//创建xhr对象
function creatXMLObject(){
     let xhr =  null;
     if(window.XMLHttpRequest){
         xhr = new XMLHttpRequest()
     }else{
         xhr = new ActiveXObject('Microsoft.XMLHttp');  //ie兼容性处理
     }
     return xhr
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
    //发送请求
    if(opts.type == 'get'){
        xhr.open(opts.type,opts.url + "?" + opts.data,opts.async)      //初始化 HTTP 请求参数
        xhr.send(null)                                                 //发送请求
    }else if(opts.type == 'post'){    
        xhr.open(opts.type,opts.url,opts.async)    
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(opts.data)
    }
    //监听
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){  //HTTP响应全部接收
            if(xhr.status == 200){
                let resText = JSON.parse(xhr.responseText)
               opts.success(resText)
            }else{
               opts.error('失败!')
            }
        }
    }

}