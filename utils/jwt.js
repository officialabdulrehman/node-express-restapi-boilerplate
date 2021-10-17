import { JWT_ALGORITHM } from "./secrets";

const algorithm = JWT_ALGORITHM;

export const options = {
  algorithm: algorithm,
  noTimestamp: false,
};
