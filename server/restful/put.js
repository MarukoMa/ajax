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

//修改信息 //users/:id
router.put('/users/:id', (ctx) => {
  let resData = {
    code:"0000",
    msg:"修改成功"
  }
  const { id } = ctx.params;
  const { name,idNumber} = ctx.request.body;
  let user = listData.find(item => item.id == id);
  console.log(user)
  console.log(id)
  console.log(ctx.request.body)
  if (user) {
      user.name = name;
      user.idNumber = idNumber;
  }else{
    resData = {
      code:"0001",
      msg:"修改失败"
    }
  }
  ctx.body = JSON.stringify(resData);
})

app.listen(4000,()=>{
  console.log('http://localhost:4000')
})