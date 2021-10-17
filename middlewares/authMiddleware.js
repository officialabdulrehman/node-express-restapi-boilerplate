import jwt from "jsonwebtoken";
import { AUTH_HEADER, SERVER_SECRET } from "../utils/secrets";

export const AuthMiddleware = (roles = []) => {
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
      const token = req.get(AUTH_HEADER).split(" ")[1];
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

    console.log(decodedToken);
    req.user = decodedToken.user;
    next();
  };
};

export default AuthMiddleware;
