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

// 删除数据
router.delete('/users/:id', (ctx) => {
  let resData = {
    code:"0000",
    msg:"删除成功"
  }
    const { id } = ctx.params
    if(id){
      listData.filter(item => item.id != ctx.params.id);
    }else{
      resData = {
        code:"0001",
        msg:"删除失败"
      }
    }
    ctx.body = JSON.stringify(resData);
})
app.listen(1000,()=>{
  console.log('http://localhost:1000')
})