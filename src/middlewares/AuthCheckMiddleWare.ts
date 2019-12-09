import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import * as cache from 'memory-cache';

@Middleware({ type: "before" })
export default class AuthCheckMiddleWare implements KoaMiddlewareInterface {
    async use(ctx: any, next: any): Promise<any> {
      try {
        const { request: { body = {}, query = {}, path } } = ctx;
        const { sid, st } = Object.assign({}, query, body);
        const user = cache.get(sid);

        if(path === '/user/login' || (user && user.token === st)) {
          await next();
        } else {
          ctx.body = {
            code: '120001',
            message: sid ? 'Session过期，请重新登录' : '请先登录',
            status: 'fail'
          };
        }
      } catch (error) {
          const { errors, message } = error;
          // console.log('error', errors, message);
          ctx.status = 200;
          ctx.body = {
              errors,
              message: message || '未知错误',
              status: 'fail',
              code: '120001',
          }
      }
      // console.log("ResponseMiddleWare after execution");
    }
}