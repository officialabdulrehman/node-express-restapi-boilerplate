import dotenv from "dotenv";
dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production";
export const MONGODB_URI = prod
  ? process.env["MONGODB_URI"]
  : process.env["MONGODB_LOCAL_URI"];

export const PORT = process.env.PORT;
export const AUTH_HEADER = process.env["AUTH_HEADER"];
export const SERVER_SECRET = process.env["SERVER_SECRET"];
export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const JWT_ALGORITHM = process.env["JWT_ALGORITHM"];
export const ACCESS_TOKEN_EXPIRATION_TIME =
  process.env["ACCESS_TOKEN_EXPIRATION_TIME"];

if (!MONGODB_URI) {
  if (prod) {
    throw new Error(
      "No mongo connection string. Set MONGODB_URI environment variable."
    );
  } else {
    throw new Error(
      "No mongo connection string. Set MONGODB_URI_LOCAL environment variable."
    );
  }
}

if (!ACCESS_TOKEN_EXPIRATION_TIME) {
  throw new Error(
    "No ACCESS_TOKEN_EXPIRATION_TIME. Set ACCESS_TOKEN_EXPIRATION_TIME environment variable."
  );
}

if (!AUTH_HEADER) {
  throw new Error("No AUTH_HEADER. Set AUTH_HEADER environment variable.");
}

if (!SESSION_SECRET) {
  throw new Error(
    "No SESSION_SECRET. Set SESSION_SECRET environment variable."
  );
}

if (!SERVER_SECRET) {
  throw new Error("No SERVER_SECRET. Set SERVER_SECRET environment variable.");
}

if (!JWT_ALGORITHM) {
  throw new Error("No JWT_ALGORITHM. Set JWT_ALGORITHM environment variable.");
}
