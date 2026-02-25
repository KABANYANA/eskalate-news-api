import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { errorResponse } from "../utils/response";

export const authorizeRole = (requiredRole: "author" | "reader") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json(errorResponse("Unauthorized", ["Authentication required"]));
    }

    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json(errorResponse("Forbidden", ["Access denied"]));
    }

    next();
  };
};