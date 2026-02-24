import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createArticle,
  getMyArticles,
  updateArticle,
  softDeleteArticle
} from "../services/article.service";
import { validateArticle } from "../validators/article.validator";
import { successResponse, errorResponse } from "../utils/response";

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validateArticle(req.body);

    if (errors.length > 0) {
      return res.status(400).json(
        errorResponse("Validation failed", errors)
      );
    }

    const article = await createArticle(req.user!.id, req.body);

    return res.status(201).json(
      successResponse("Article created", article)
    );
  } catch {
    return res.status(500).json(
      errorResponse("Internal server error", [])
    );
  }
};

export const listMine = async (req: AuthRequest, res: Response) => {
  const articles = await getMyArticles(req.user!.id);

  return res.json(
    successResponse("Articles retrieved", articles)
  );
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const article = await updateArticle(
      req.params.id,
      req.user!.id,
      req.body
    );

    return res.json(
      successResponse("Article updated", article)
    );
  } catch (error: any) {
    if (error.message === "NotFound") {
      return res.status(404).json(
        errorResponse("Not Found", ["Article not found"])
      );
    }

    if (error.message === "Forbidden") {
      return res.status(403).json(
        errorResponse("Forbidden", ["You cannot modify this article"])
      );
    }

    return res.status(500).json(
      errorResponse("Internal server error", [])
    );
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    await softDeleteArticle(req.params.id, req.user!.id);

    return res.json(
      successResponse("Article deleted", null)
    );
  } catch (error: any) {
    if (error.message === "NotFound") {
      return res.status(404).json(
        errorResponse("Not Found", ["Article not found"])
      );
    }

    if (error.message === "Forbidden") {
      return res.status(403).json(
        errorResponse("Forbidden", ["You cannot delete this article"])
      );
    }

    return res.status(500).json(
      errorResponse("Internal server error", [])
    );
  }
};