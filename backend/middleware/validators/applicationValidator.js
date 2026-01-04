import { body } from "express-validator";

// Validation rules for job application
export const validateApplyJob = [
  body("coverLetter")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Cover letter must not exceed 1000 characters")
    .escape(),
];

// Validation rules for updating application status
export const validateUpdateStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["applied", "shortlisted", "rejected"])
    .withMessage("Status must be one of: applied, shortlisted, rejected"),
];
