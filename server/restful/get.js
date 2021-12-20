const koa = require('koa')
const app = new koa()
const koaRouter = require('koa-router')
const koaCors = require('../koaCors')
const router = new koaRouter()
const BodyParser = require('koa-bodyparser');
const bodyparser= new BodyParser();
const listData = require('../mock/lists.json')

app.use(koaCors())
app.use(bodyparser); 
app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());

// 查询数据
router.get('/users/:id',ctx => {
    let resData = {
      code:"0000",
      data:{},
      total:0,
      msg:"success"
    }
    const {id}= ctx.params;
    if(id){
        resData.data = listData.find(item => item.id == id);
    }else{
        resData = {
            code:"9999",
            msg:"参数错误"
        }
    }
    ctx.body = JSON.stringify(resData)
})

app.listen(2000,()=>{
  console.log('http://localhost:2000')
})