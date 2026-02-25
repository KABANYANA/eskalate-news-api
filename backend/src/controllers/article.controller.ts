import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createArticle,
  getMyArticles,
  updateArticle,
  softDeleteArticle,
  getPublicArticles,
  getArticleById,
  logRead,
  extractReaderFromToken
} from "../services/article.service";
import { validateArticle } from "../validators/article.validator";
import { successResponse, errorResponse } from "../utils/response";


  // PUBLIC: Get Article By ID + Log Read
 
export const getOne = async (req: any, res: Response) => {
  try {
    const article = await getArticleById(req.params.id);

    if (!article) {
      return res.status(404).json({
        Success: false,
        Message: "News article no longer available",
        Object: null,
        Errors: null
      });
    }

    // Extract readerId (optional)
    const readerId = extractReaderFromToken(
      req.headers.authorization
    );

    // Non-blocking log
    logRead(article.id, readerId).catch(() => {});

    return res.json(
      successResponse("Article retrieved", article)
    );
  } catch {
    return res
      .status(500)
      .json(errorResponse("Internal server error", []));
  }
};


//  CREATE
 
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


  // LIST MINE
 
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


  // UPDATE
 
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


//  DELETE
 
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


//  PUBLIC FEED
 
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