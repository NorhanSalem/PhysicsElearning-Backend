const { body, param, query } = require("express-validator");

exports.post = [
    body("firstName").isString().withMessage("First Name must be string"),
    body("lastName").isString().withMessage("Last Name must be string"),
    body("password").isLength({min: 8}).withMessage("Password Must be Min length 8"),
    body("email").isEmail().withMessage("Invalid Email Format"),
    body("birthdate").isDate().withMessage("Invalid Date"),
];

exports.update = [
    body("firstName").optional().isString().withMessage("First Name must be string"),
    body("lastName").optional().isString().withMessage("Last Name must be string"),
    body("password").optional().isLength({min: 8}).withMessage("Password Must be Min length 8"),
    body("email").optional().isEmail().withMessage("Invalid Email Format"),
    body("birthdate").optional().isDate().withMessage("Invalid Date"),
];

