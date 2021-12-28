# ajax
笔者手动封装ajax请求，主要功能包含  
* 支持 method（get/post/delete/put)
*  支持设置delay（延迟请求时间）、abort（取消请求）、timeout（超时的取消请求）
*支持jsonp请求方式

## options

* type  可设置get post put delete四种类型,默认为get方式  
* url   请求地址 
* data  页发送到服务器的数据,get请求中将附加在 URL后。
* dataType 设置数据交换格式,默认值为json
* async 请求均为异步请求,默认为true
* timeout  设置超时的取消请求,默认为ms,初始值为0
* jsonpCallback 为jsonp请求指定一个回调函数名.默认为随机生成的
* delay 设置延迟请求时间,,默认为ms,初始值为0
* success 成功回调函数
* error 失败回调函数
### Example
```javascript
  ajax({
      type:"POST",
      url:"http://localhost:3000/users",
      data:{name:'小新',idNumber:"321*****11108"},
      async:true,
      dataType: "json",
      timeout:0,
      delay:30,
      success:function(data){
        console.log(JSON.stringify(data))
      },
      error:function(data){
         console.log('err !')
      }
  })

```
### tips:  两种形式封装,调用传参方式相同,可选其一
* ajax.js 为普通函数式封装
* modelAjax.js 使用构造函数封装
