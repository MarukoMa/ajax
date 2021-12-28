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
/*
* 构造函数创建
* opts 请求参数传递 
*/
function Ajax(opts) {
    this.opts = Object.assign(defaultOpts, opts)
    this.send = function () {
        const {data, type, dataType, async, header, timeout, success, error} = this.opts
        let {url, jsonpCallback} = this.opts
        const params = data && this.formatParams(data)
        if(dataType.toLowerCase() === 'jsonp'){
            if(!url){
                throw new Error('参数不合法')
            }
            //创建script 标签并加入页面中
            //设置回调函数的名称
            const callbackName = jsonpCallback || ('jsonp_callback_' + this.jsonpCallbackName(6))
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            head.appendChild(script)
            //创建jsonp 回调函数
            window[callbackName] = function(json) {
                head.removeChild(script)
                clearTimeout(timer)
                window[callbackName] = null
                success && success(json);
            }
            //发送请求
            script.src = `${url}?${params}&callback=${callbackName}`
            //超时处理
            let timer = timeout && setTimeout(function() {
                delete window[callbackName];
                head.removeChild(script)
                error && error('请求超时!');
            }, timeout);
            
        }else{
            const xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHttp');  //ie兼容性处理
            if(type.toLowerCase() == "get") {
                url += ('?' + params)
            }
            xhr.open(type, url, async)  //初始化 HTTP 请求参数
            header && this.setReqHeader({header,xhr})
            if(type.toLowerCase() === "post") { 
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
            }
            //超时设置
            let isTimer = false
            let timer = timeout && setTimeout(function() {
                isTimer = true;
                xhr && xhr.abort();
            }, timeout);
            //监听
            xhr.onreadystatechange = function() {
                //超时处理
                if(isTimer) {return}
                clearTimeout(timer)
                //延迟请求
                if(xhr.readyState === 4) {  //HTTP响应全部接收
                    if(xhr.status >= 200 && xhr.status < 300) {
                        let resText = xhr.responseText;
                        try{
                            switch(dataType.toLowerCase()){
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
                        success(resText)
                    }else {
                        error(xhr.status)
                    }
                }
            }
        }
    }
    //延时设置
    if(this.opts.delay > 0) {
        setTimeout(function() {
           this.send()
        },delay)
    }else {
        this.send()
    }
}

Ajax.prototype = {
    /*
    * @param opts  参数拼接处理
    */
    formatParams: function(data) {
        let dataStr = '';
        for (let item in data) {
            dataStr += ( dataStr ? "&" : "") + item + '=' + data[item]
        }
        return dataStr
    },
    /*
    * jsonp callback回调函数名称生成
    * @param long Number类型,默认值32
    */
    jsonpCallbackName: function(long) {
        const length = long || 32;
        const initData = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let name = "";
        for(let i=0; i < length; i++){
            name += initData.charAt(Math.floor(Math.random()*length))
        }
        return name
    },
    /*
    * 请求头设置
    * @param params 请求头部设置,Object类型
    * headerOpts 头部设置信息
    * xhr xhr
    */
    setReqHeader: function(params) {
        for(let item in params.headerOpts) {
            params.xhr.setRequestHeader(item,headerOpts[item])
        }
     }
}
function  ajax(opts) {
    return new Ajax(opts)
}
