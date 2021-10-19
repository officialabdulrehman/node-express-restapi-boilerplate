import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  SERVER_SECRET,
  JWT_ALGORITHM,
  ACCESS_TOKEN_EXPIRATION_TIME,
} from "../../utils/secrets";

export const genPassword = async (password, salt = 10) => {
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const genToken = (data) => {
  return {
    accessToken: jwt.sign(data, SERVER_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
      algorithm: JWT_ALGORITHM,
    }),
    iat: parseInt(Date.now() / 1000),
    exp: parseInt(Date.now() / 1000) + 3600,
  };
};

export const verifyToken = (token) => {
  return jwt.verify(token, SERVER_SECRET, { algorithms: [JWT_ALGORITHM] });
};
