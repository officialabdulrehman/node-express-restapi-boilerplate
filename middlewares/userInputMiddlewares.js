import { check } from "express-validator";

export const SignupValidator = [
  check("email", "Please enter a valid email").isEmail().normalizeEmail(),
  check("confirmPassword", "Passwords do not match")
    .trim()
    .custom((value, { req }) => {
      if (!req.body.confirmPassword)
        return Promise.reject("Missing field: confirmPassword");
      if (value !== req.body.password)
        return Promise.reject("Passwords do not match");
      return true;
    }),
  check("password")
    .trim()
    .custom((value, { req }) => {
      if (!value) return Promise.reject("Missing field: password");
      var regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!regex.test(value))
        return Promise.reject(
          "Password must contain at least 8 letters, with at least a symbol, upper and lower case letters and a number"
        );
      return true;
    }),
];

export const SignValidator = [
  check("email", "Please enter a valid email")
    .trim()
    .isEmail()
    .normalizeEmail(),
  check("password", "Please enter a password").trim(),
];

export const emailValidator = [
  check("email", "Please enter a valid email")
    .trim()
    .isEmail()
    .normalizeEmail(),
];
