const koa = require('koa');
const koaRouter = require('koa-router');

const app = new koa();
const router = koaRouter();

router.get('/healthcheck', async ctx => {
  ctx.body = 'OK';
});

app.use(router.routes());
app.listen(8000);

console.log('>> http server listening, healthcheck:OK provided on /healthcheck');
