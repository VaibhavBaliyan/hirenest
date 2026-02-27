import { body } from "express-validator";

// Validation rules for user registration
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),

  body("role")
    .optional()
    .isIn(["employer", "jobseeker"])
    .withMessage("Role must be either employer or jobseeker"),

  body("phone")
    .optional({ checkFalsy: true })
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),
];

// Validation rules for user login
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];
