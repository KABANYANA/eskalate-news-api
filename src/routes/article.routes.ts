import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/rbac.middleware";
import {
  create,
  listMine,
  update,
  remove
} from "../controllers/article.controller";

const router = Router();

router.use(authenticate, authorizeRole("author"));

router.post("/", create);
router.get("/me", listMine);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;