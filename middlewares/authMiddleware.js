import jwt from "jsonwebtoken";
import { AUTH_HEADER, SERVER_SECRET } from "../utils/secrets";

export const AuthMiddleware = (role = undefined) => {
  return (req, res, next) => {
    let decodedToken = null;

    const authHeader = req.get(AUTH_HEADER);

    if (!authHeader) {
      const error = new Error("Header containing token missing");
      error.data = [
        {
          param: "token",
          location: "header",
          value: "",
        },
      ];
      error.code = 401;
      return next(error);
    }
    try {
      let token = req.get(AUTH_HEADER).split(" ")[1];
      if (!token) token = req.get(AUTH_HEADER);
      decodedToken = jwt.verify(token, SERVER_SECRET);
    } catch (err) {
      const error = new Error("Invalid Token");
      error.data = [
        {
          param: "token",
          location: "header",
          value: authHeader,
        },
      ];
      error.code = 401;
      return next(error);
    }
    if (!decodedToken) {
      const error = new Error("Unidentified Token");
      error.data = [
        {
          param: "token",
          location: "header",
          value: authHeader,
        },
      ];
      error.code = 401;
      return next(error);
    }
    req.user = decodedToken;
    if (role && req.user.role !== role) {
      const error = new Error("Unauthorized access");
      error.data = [
        {
          param: "",
          location: "",
          value: "",
        },
      ];
      error.code = 401;
      return next(error);
    }
    return next();
  };
};

export default AuthMiddleware;
