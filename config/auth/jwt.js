import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  SERVER_SECRET,
  JWT_ALGORITHM,
  REFRESH_TOKEN_SECRET,
} from "../../utils/secrets";

const _1hour = 60 * 60;
const _30days = 60 * 60 * 24 * 30;
const _time = () => parseInt(Date.now() / 1000);

export const genPassword = async (password, salt = 10) => {
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const genToken = (data) => {
  return {
    accessToken: jwt.sign(data, SERVER_SECRET, {
      expiresIn: "1h",
      algorithm: JWT_ALGORITHM,
    }),
    iat: _time(),
    exp: _time() + _1hour,
    access_expires_in: _1hour,
    refreshToken: jwt.sign({ id: data }, REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
      algorithm: JWT_ALGORITHM,
    }),
    refresh_iat: _time(),
    refresh_exp: _time() + _30days,
    refresh_expires_in: _30days,
  };
};

export const verifyToken = (token) => {
  return jwt.verify(token, SERVER_SECRET, { algorithms: [JWT_ALGORITHM] });
};
