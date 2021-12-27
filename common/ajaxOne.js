
function ajax(obj){
  var defaults = {
  type:'get',
  url:'#',
  dataType:'text',
  jsonp:'callback',
  data:{},
  async:true,
  success:function(data){console.log(data);}
  };
  for(var k in obj){
  defaults[k] = obj[k];
  }
  if(defaults.dataType == 'jsonp') {
  //调用jsonp
      ajaxForJsonp(defaults);
  }
  else {
  //调用ajax json
    ajaxForJson(defaults);
  }
}
 
//json数据格式
function ajaxForJson(defaults){
  //1、创建XMLHttpRequset对象
  var xhr = null;
  if(window.XMLHttpRequest){
      xhr = new XMLHttpRequest();
  }else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var param = '';
  for(var key in defaults.data) {
      param += key + '='+ defaults.data[key] + '&';
  }
  if(param){
       param = param.slice(0, param.length-1);
  }
// 处理get请求参数并且处理中文乱码问题
if(defaults.type == 'get') {
    defaults.url += '?' + encodeURI(param);
}
//2、准备发送（设置发送的参数）
xhr.open(defaults.type,defaults.url,defaults.async);
// 处理post请求参数并且设置请求头信息（必须设置）
var data = null;
if(defaults.type == 'post') {
  data = param;
  //设置请求头
  xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
// 3、执行发送动作
    xhr.send(data);
    //处理同步请求，不会调用回调函数
  if(!defaults.async) {
    if(defaults.dataType == 'json'){
        return JSON.parse(xhr.responseText);
    }
    else {
        return xhr.responseText;
    }
  }
//// 4、指定回调函数（处理服务器响应数据）
  xhr.onreadystatechange = function() {
      if(xhr.readyState == 4){
          if(xhr.status == 200){
              var data = xhr.responseText;
              if(defaults.dataType == 'json'){
                  data = JSON.parse(data);
              }
              defaults.success(data);
          }
      }
  }
}
 
//跨域jsonp
function ajaxForJsonp(defaults){
//cbName默认的是回调函数名称
var cbName = 'jQuery' + ('1.12.2' + Math.random()).replace(/\D/g,'') + '_' + (new Date().getTime());
if(defaults.jsonpCallback) {
cbName = defaults.jsonpCallback;
}
//这里就是回调函数，调用方式：服务器响应内容来调用
//向window对象中添加一个方法，方法名是变量cname的值
window[cbName] = function(data) {
defaults.success(data);//这里success的data是实参
}
var param = '';
for(var key in defaults.data){
param += key + '=' + defaults.data[key] + '&'; 
}
if(param){
param = param.slice(0, param.length-1);
param = '&' + param;
}
var script = document.createElement('script');
script.src = defaults.url + '?' + defaults.jsonp + '=' + cbName + param;
var head = document.getElementsByTagName('head')[0];
head.appendChild(script);
}