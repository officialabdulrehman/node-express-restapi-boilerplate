import { check, sanitize, oneOf } from "express-validator";

import { restApiValidation, response } from "../../utils/helpers";

import { RouterClass } from "../Router";

import { ResourceRouter } from "../ResourceRouter";

import { userService } from "../../service/user/user";
import { UserDTO } from "../../dto/user/User.dto";

import _ from "lodash";

import { AuthMiddleware } from "../../middlewares/authMiddleware";
import {
  SignupValidator,
  SignValidator,
} from "../../middlewares/userInputMiddlewares";
import { Roles } from "../../dto/user/Roles";

class UserRouter extends ResourceRouter {
  GETID(path, middleware, callback) {
    super.GETID(path, [...middleware], async (req, res, next) => {
      restApiValidation(req, res, next);
      const id = String(req.params.id);
      const result = await userService.findById(id);
      response(res, result);
    });
  }

  GET(path, middleware, callback) {
    super.GET(path, [...middleware], callback);
  }

  POST(path, middleware, callback) {
    super.POST(
      "/signup",
      [...middleware, ...SignupValidator],
      async (req, res, next) => {
        restApiValidation(req, res, next);
        const result = await userService.signup(req.body);
        response(res, result);
      }
    );
  }

  PATCH(path, middleware, callback) {
    super.PATCH(path, [...middleware], callback);
  }

  DELETE(path, middleware, callback) {
    super.DELETE(path, [...middleware], callback);
  }
}

export const userRouter = new UserRouter(new UserDTO(), userService, []);
export default userRouter;

userRouter.post("/signin", [...SignValidator], async (req, res, next) => {
  restApiValidation(req, res, next);
  const result = await userService.signin(req.body);
  response(res, result);
});

userRouter.post("/refresh-token", [], async (req, res, next) => {
  restApiValidation(req, res, next);
  const result = await userService.refreshToken(req.body.refreshToken);
  response(res, result);
});

userRouter.get("/profile/get", [AuthMiddleware()], async (req, res, next) => {
  restApiValidation(req, res, next);
  const result = await userService.getSelfProfile(req.user.id);
  response(res, result);
});
