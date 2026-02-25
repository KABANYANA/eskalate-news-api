import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/rbac.middleware";
import {
  create,
  listMine,
  update,
  remove,
  listPublic,
  getOne
} from "../controllers/article.controller";

const router = Router();


  // Public routes
 
router.get("/", listPublic);
router.get("/:id", getOne);


  // Author-only routes
 
router.use(authenticate, authorizeRole("author"));

router.post("/", create);
router.get("/me", listMine);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;