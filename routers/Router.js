import { Router } from "express";
import { catchAsync } from "../utils/helpers";

export class RouterClass {
  router = Router();

  middlewares = [];
  constructor(middlewares) {
    if (!middlewares) {
      middlewares = [];
    }

    this.middlewares = middlewares;
  }

  wrapper(callback) {
    const wrap = catchAsync(async (req, res, next) => {
      const fun = async () => {
        await callback(req, res, next);
      };
      return await fun();
    });

    return wrap;
  }

  get(path, middleware, callback) {
    const wrap = this.wrapper(callback);
    middleware = [...this.middlewares, ...middleware];
    this.router.get(path, ...middleware, wrap);
  }

  post(path, middleware, callback) {
    const wrap = this.wrapper(callback);
    middleware = [...this.middlewares, ...middleware];
    this.router.post(path, ...middleware, wrap);
  }

  patch(path, middleware, callback) {
    const wrap = this.wrapper(callback);
    middleware = [...this.middlewares, ...middleware];
    this.router.patch(path, ...middleware, wrap);
  }

  delete(path, middleware, callback) {
    const wrap = this.wrapper(callback);
    middleware = [...this.middlewares, ...middleware];
    this.router.delete(path, ...middleware, wrap);
  }

  put(path, middleware, callback) {
    const wrap = this.wrapper(callback);
    middleware = [...this.middlewares, ...middleware];
    this.router.put(path, ...middleware, wrap);
  }

  head(path, middleware, callback) {
    const wrap = this.wrapper(callback);
    middleware = [...this.middlewares, ...middleware];
    this.router.head(path, ...middleware, wrap);
  }

  Router() {
    return this.router;
  }
}
