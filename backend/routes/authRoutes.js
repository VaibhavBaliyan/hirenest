import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validators/authValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validateRegister, validate, registerUser);
router.post("/login", validateLogin, validate, loginUser);

// Protected test route - requires authentication
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Authentication successful! You are logged in.",
    user: req.user,
  });
});

export default router;
