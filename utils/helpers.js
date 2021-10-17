import { validationResult } from "express-validator";
import mongoose from "mongoose";

const ID = mongoose.Types.ObjectId;

export const restApiValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(`Bad Request`);
    error.data = errors.array().map((err) => {
      return {
        message: err.msg || "",
        param: err.param || "",
        location: err.location || "",
        value: err.value || "",
      };
    });
    error.code = 400;
    return next(error);
  }
  return true;
};

const setPaginationURLs = (res, result) => {
  if (
    result.pagination &&
    (result.pagination.next === "" || result.pagination.next)
  ) {
    const { pagination } = result;
    const { page, perPage, hasNext, hasPrevious } = pagination;
    const baseURL =
      res.req?.protocol + "://" + res.req?.get("host") + res.req?.originalUrl;
    const nextpage = `${baseURL}?page=${page + 1}&perPage=${perPage}`;
    const prevpage = `${baseURL}?page=${page - 1}&perPage=${perPage}`;
    pagination.next = null;
    pagination.previous = null;
    if (hasNext) pagination.next = nextpage;
    if (hasPrevious) pagination.previous = prevpage;
  }
  return result;
};

export const response = (res, result) => {
  result = setPaginationURLs(res, result);
  const response = {
    message: "Success",
    result: result,
    errors: [],
  };
  res.status(200).json(response);
};

export const catchAsync =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[2]);

export const mongoID = (value, { path }) => {
  try {
    const id = ID(value);
    return id;
  } catch (err) {
    let msg = err.message || "";
    msg = `Argument: '${path}' error: ${msg}`;
    throw new Error(msg);
  }
};

export const defaultErrorHandler = (err, req, res, next) => {
  const { code, message, data } = err;
  let statusCode = code;
  if (statusCode == 11000) statusCode = 409;
  res.status(statusCode || 500).json({
    message,
    result: {},
    errors: data
      ? data.map(({ param = "", location = "", value = "", message = "" }) => {
          return {
            message,
            param,
            location,
            value,
          };
        })
      : [
          {
            message: "",
            param: "",
            location: "",
            value: "",
          },
        ],
  });
};
