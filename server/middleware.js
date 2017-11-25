const Koa = require('koa');
const KoaMount = require('koa-mount');
const KoaStatic = require('koa-static-server');

module.exports = () => KoaMount('/static',
(new Koa())
.use(
  KoaStatic({
    rootDir: '/tmp',
    //notFoundFile: '/tmp/404.png',
    log: true,
  })
));
