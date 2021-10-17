// import { Router } from "express";
// import { userDAO } from "../dao/userDAO";
// import { restApiValidation, response } from "../../utils/helpers";
// import { checkParamId } from "../../middlewares/commonMiddlewares";
// import {
//   userSignupInputValidator,
//   emailValidator,
// } from "../../middlewares/userInputMiddlewares";

// export const testRouter = Router();
// export default testRouter;

// testRouter.get("/", [], async (req, res, next) => {
//   const result = await userDAO.find({});
//   response(res, result);
// });

// testRouter.get("/:id", [...checkParamId], async (req, res, next) => {
//   if (!restApiValidation(req, next)) return next();
//   const id = String(req.params.id);
//   const result = await userDAO.findById(id);
//   response(res, result);
// });

// testRouter.post("/", [...userSignupInputValidator], async (req, res, next) => {
//   if (!restApiValidation(req, next)) return next();
//   const result = await userDAO.create({ ...req.body });
//   response(res, result);
// });

// testRouter.put("/:id", [...checkParamId], async (req, res, next) => {
//   if (!restApiValidation(req, next)) return next();
//   const id = String(req.params.id);
//   const result = await userDAO.findByIdAndUpdate(id, { ...req.body });
//   response(res, result);
// });

// testRouter.delete("/:id", [...checkParamId], async (req, res, next) => {
//   if (!restApiValidation(req, next)) return next();
//   const id = String(req.params.id);
//   const result = await userDAO.delete(id);
//   response(res, result);
// });

// testRouter.post("/user", [...emailValidator], async (req, res, next) => {
//   const { email } = req.body;
//   const result = await userDAO.findByEmail(email);
//   if (result.length <= 0) {
//     const error = new Error("Failure");
//     error.data = [
//       { message: `Record with email ${email} not found.`, param: "email" },
//     ];
//     error.code = 404;
//     return next(error);
//   }
//   response(res, result);
// });
