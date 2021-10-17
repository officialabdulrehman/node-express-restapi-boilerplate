import { check, sanitize, oneOf } from "express-validator";

import { restApiValidation, response } from "../../utils/helpers";

import { RouterClass } from "../Router";

import { ResourceRouter } from "../ResourceRouter";

import { userService } from "../../service/user/user";
import { UserDTO } from "../../dto/user/User.dto";

import _ from "lodash";

import { AuthMiddleware } from "../../middlewares/authMiddleware";

class UserRouter extends ResourceRouter {
  GETID(path, middleware, callback) {
    middleware = [...middleware];
    super.GETID(path, middleware, async (req, res, next) => {
      restApiValidation(req, next);
      const id = String(req.params.id);
      const result = await userService.findById(id);
      response(res, result);
    });
  }

  GET(path, middleware, callback) {
    middleware = [...middleware];
    super.GET(path, middleware, callback);
  }

  POST(path, middleware, callback) {
    middleware = [...middleware];
    super.POST(path, middleware, callback);
  }

  PATCH(path, middleware, callback) {
    middleware = [...middleware];
    super.PATCH(path, middleware, callback);
  }

  DELETE(path, middleware, callback) {
    middleware = [...middleware];
    super.DELETE(path, middleware, callback);
  }
}

export const userRouter = new UserRouter(new UserDTO(), userService, []);
export default userRouter;

userRouter.post(
  "/user/test/auth-token",
  [AuthMiddleware()],
  async (req, res, next) => {
    restApiValidation(req, next);
    const result = {
      ...req.body,
      message: "success",
    };
    response(res, result);
  }
);
