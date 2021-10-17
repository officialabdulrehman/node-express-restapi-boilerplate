import { check, sanitize, oneOf } from "express-validator";

import {
  catchAsync,
  restApiValidation,
  response,
  mongoID,
} from "../utils/helpers";
import { flattenObj, isPlainObj } from "../utils/transformers";
import { RouterClass } from "./Router";

export class ResourceRouter extends RouterClass {
  m;
  service;

  constructor(m, service, middlewaress) {
    super(middlewaress);
    this.m = m;
    delete m.id;
    this.service = service;
    this.init();
  }

  async validate(req) {
    let m = this.m;

    m = flattenObj(m);
    const keys = Object.keys(m);
    let body = req.body;
    body = flattenObj(body);
    for (const k of keys) {
      const val = m[k];
      if (val === undefined) {
        await check(k, `${k} is invalid`).optional().run(req);
        continue;
      }
      await check(k, `${k} is invalid or - Here ?`).exists().run(req);
    }
  }

  async resourceGet(req, res, next) {
    await check("page", "page must be an integer greater than 0")
      .optional()
      .isInt({ gt: 0 })
      .run(req);
    await check("perPage", "perPage must be an integer greater than 0")
      .optional()
      .isInt({ gt: 0 })
      .run(req);
    restApiValidation(req, res, next);
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 10;
    page = parseInt(page);
    perPage = parseInt(perPage);

    delete req.query.page;
    delete req.query.perPage;
    const query = req.query || {};
    const result = await this.service.find(query, page, perPage);
    response(res, result);
  }

  async resourceGetId(req, res, next) {
    await check("id", "id is required")
      .exists()
      .customSanitizer(mongoID)
      .run(req);
    restApiValidation(req, res, next);
    const Id = String(req.params.id);
    const result = await this.service.findById(Id);
    response(res, result);
  }

  async resourceCreate(req, res, next) {
    await this.validate(req);
    restApiValidation(req, res, next);

    const data = req.body;
    const result = await this.service.create(data);
    response(res, result);
  }

  async resourceUpdate(req, res, next) {
    await check("id", "id is required")
      .exists()
      .customSanitizer(mongoID)
      .run(req);
    restApiValidation(req, res, next);

    const Id = String(req.params.id);
    const updates = req.body;
    const result = await this.service.update(Id, updates);
    response(res, result);
  }

  async resourceDelete(req, res, next) {
    await check("id", "id is required")
      .exists()
      .customSanitizer(mongoID)
      .run(req);
    restApiValidation(req, res, next);

    const Id = String(req.params.id);
    const result = await this.service.delete(Id);
    response(res, result);
  }

  GET(path, middlewares, callback) {
    this.get(
      path,
      middlewares,
      catchAsync(async (req, res, next) => {
        await callback(req, res, next);
      })
    );
  }

  GETID(path, middlewares, callback) {
    this.get(
      path,
      middlewares,
      catchAsync(async (req, res, next) => {
        // await this.resourceGetId(req, res, next);
        await callback(req, res, next);
      })
    );
  }

  POST(path, middlewares, callback) {
    this.post(
      path,
      middlewares,
      catchAsync(async (req, res, next) => {
        // await this.resourceCreate(req, res, next);
        await callback(req, res, next);
      })
    );
  }

  PATCH(path, middlewares, callback) {
    this.patch(
      path,
      middlewares,
      catchAsync(async (req, res, next) => {
        // await this.resourceUpdate(req, res, next);
        await callback(req, res, next);
      })
    );
  }

  DELETE(path, middlewares, callback) {
    this.delete(
      path,
      middlewares,
      catchAsync(async (req, res, next) => {
        // await this.resourceDelete(req, res, next);
        await callback(req, res, next);
      })
    );
  }

  init() {
    this.GET("/", [], (req, res, next) => this.resourceGet(req, res, next));
    this.GETID("/:id", [], (req, res, next) =>
      this.resourceGetId(req, res, next)
    );
    this.POST("/", [], (req, res, next) => this.resourceCreate(req, res, next));
    this.PATCH("/:id", [], (req, res, next) =>
      this.resourceUpdate(req, res, next)
    );
    this.DELETE("/:id", [], (req, res, next) =>
      this.resourceDelete(req, res, next)
    );
  }
}
