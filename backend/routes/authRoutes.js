import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected test route - requires authentication
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Authentication successful! You are logged in.",
    user: req.user,
  });
});

export default router;
