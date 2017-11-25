const koa = require('koa');
const koaRouter = require('koa-router');
const koaMiddleware = require('./middleware');

const app = new koa();
const router = koaRouter();
const middleware = koaMiddleware();

// Apply default route
router.get('/', async ctx => {
  ctx.body = 'Hello';
});

// Apply healthcheck route
router.get('/healthcheck', async ctx => {
  ctx.body = 'OK';
});

// Apply middleware
app
.use(middleware)
.use(router.routes());

app.listen(8000);

console.log('>> http server listening healthcheck=yes, static[/tmp]=yes');
