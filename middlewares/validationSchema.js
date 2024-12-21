const {body} = require("express-validator");
const middleware = [
    body("title")
      .notEmpty()
      .withMessage("the title is provided")
      .isLength({ min: 2, max: 10 })
      .withMessage("the title should be min 2 chars and 10 chars max"),
    body("price").notEmpty().withMessage("price is required"),
  ]

module.exports = {middleware}