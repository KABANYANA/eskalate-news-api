import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getAuthorDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const skip = (page - 1) * size;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          authorId: userId,
          deletedAt: null,
        },
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        include: {
          analytics: true,
        },
      }),
      prisma.article.count({
        where: {
          authorId: userId,
          deletedAt: null,
        },
      }),
    ]);

    const responseData = articles.map((article) => ({
      title: article.title,
      createdAt: article.createdAt,
      totalViews: article.analytics.reduce(
        (sum, a) => sum + a.viewCount,
        0
      ),
    }));

    return res.json({
      Success: true,
      Message: "Dashboard retrieved",
      Object: responseData,
      PageNumber: page,
      PageSize: size,
      TotalSize: total,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: "Failed to retrieve dashboard",
      Object: null,
      Errors: ["Internal server error"],
    });
  }
};