import { body } from "express-validator";

// Validation rules for job creation
export const validateCreateJob = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Job title must be between 3 and 100 characters")
    .escape(),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Job description must be between 10 and 2000 characters")
    .escape(),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .escape(),

  body("jobType")
    .notEmpty()
    .withMessage("Job type is required")
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid job type"),

  body("salary.min")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum salary must be a positive number"),

  body("salary.max")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Maximum salary must be a positive number")
    .custom((value, { req }) => {
      if (req.body.salary?.min && value < req.body.salary.min) {
        throw new Error(
          "Maximum salary must be greater than or equal to minimum salary"
        );
      }
      return true;
    }),

  body("skills")
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),

  body("skills.*")
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty")
    .escape(),

  body("experience.min")
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage("Minimum experience must be between 0 and 50 years"),

  body("experience.max")
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage("Maximum experience must be between 0 and 50 years")
    .custom((value, { req }) => {
      if (req.body.experience?.min && value < req.body.experience.min) {
        throw new Error(
          "Maximum experience must be greater than or equal to minimum experience"
        );
      }
      return true;
    }),
];

// Validation rules for job update
export const validateUpdateJob = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Job title must be between 3 and 100 characters")
    .escape(),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Job description must be between 10 and 2000 characters")
    .escape(),

  body("location").optional().trim().escape(),

  body("jobType")
    .optional()
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid job type"),

  body("salary.min")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum salary must be a positive number"),

  body("salary.max")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Maximum salary must be a positive number"),

  body("skills")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),

  body("skills.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty")
    .escape(),
];
