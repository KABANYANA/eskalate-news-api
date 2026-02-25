import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/rbac.middleware";
import { getAuthorDashboard } from "../controllers/dashboard.controller";

const router = Router();
router.get(
  "/",
  authenticate,
  authorizeRole("author"),
  getAuthorDashboard
);

export default router;