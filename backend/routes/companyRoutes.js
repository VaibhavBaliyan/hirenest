import express from "express";
import {
  registerCompany,
  getMyCompany,
  updateCompany,
} from "../controllers/companyController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
// Ideally add validation middleware here

const router = express.Router();

router.use(protect);
router.use(restrictTo("employer"));

router.post("/", registerCompany);
router.get("/mine", getMyCompany);
router.put("/mine", updateCompany);

export default router;
