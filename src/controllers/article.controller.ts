import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createArticle,
  getMyArticles,
  updateArticle,
  softDeleteArticle,
  getPublicArticles
} from "../services/article.service";
import { validateArticle } from "../validators/article.validator";
import { successResponse, errorResponse } from "../utils/response";


//  Create Article (Author Only)

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validateArticle(req.body);

    if (errors.length > 0) {
      return res
        .status(400)
        .json(errorResponse("Validation failed", errors));
    }

    const article = await createArticle(req.user!.id, req.body);

    return res
      .status(201)
      .json(successResponse("Article created", article));
  } catch {
    return res
      .status(500)
      .json(errorResponse("Internal server error", []));
  }
};


  // List Author Articles
  // Excludes soft-deleted by default
  // ?includeDeleted=true to include them
 
export const listMine = async (req: AuthRequest, res: Response) => {
  try {
    const includeDeleted = req.query.includeDeleted === "true";

    const articles = await getMyArticles(
      req.user!.id,
      includeDeleted
    );

    return res.json(
      successResponse("Articles retrieved", articles)
    );
  } catch {
    return res
      .status(500)
      .json(errorResponse("Internal server error", []));
  }
};


  // Update Article (Ownership enforced)

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
        errorResponse("Forbidden", [
          "You cannot modify this article"
        ])
      );
    }

    return res
      .status(500)
      .json(errorResponse("Internal server error", []));
  }
};

// Soft Delete Article
 
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
        errorResponse("Forbidden", [
          "You cannot delete this article"
        ])
      );
    }

    return res
      .status(500)
      .json(errorResponse("Internal server error", []));
  }
};


//  Public News Feed
//  - Published only
//  - Not soft deleted
//  - Supports filtering
//  - Supports pagination

export const listPublic = async (req: any, res: Response) => {
  try {
    const result = await getPublicArticles(req.query);

    return res.json({
      Success: true,
      Message: "Articles retrieved",
      Object: result.data,
      PageNumber: result.page,
      PageSize: result.size,
      TotalSize: result.total,
      Errors: null
    });
  } catch {
    return res
      .status(500)
      .json(errorResponse("Internal server error", []));
  }
};