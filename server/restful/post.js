const koa = require('koa')
const app = new koa()
const koaCors = require('../koaCors')
const koaRouter = require('koa-router')
const router = new koaRouter()
const BodyParser = require('koa-bodyparser');
const bodyparser= new BodyParser();
const listData = require('../mock/lists.json')

app.use(koaCors())
app.use(bodyparser); 
app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());
//post 新增数据
router.post('/users',ctx => {
  let resData = {
    code:"0000",
    msg:"新增成功"
  }
  const {name,idNumber} = ctx.request.body;
  if(name && idNumber){
      listData.push({
        id:listData.length + 1,
        name,
        idNumber
      })
  }else{
      resData = {
          code:"0001",
          msg:"新增失败"
      }
  }
  console.log(name)
  ctx.body = JSON.stringify(resData)
})
app.listen(3000,()=>{
  console.log('http://localhost:3000')
})