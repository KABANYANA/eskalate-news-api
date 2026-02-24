import prisma from "../config/prisma";

export const createArticle = async (
  authorId: string,
  data: any
) => {
  return prisma.article.create({
    data: {
      title: data.title.trim(),
      content: data.content,
      category: data.category.trim(),
      status: data.status || "Draft",
      authorId
    }
  });
};

export const getMyArticles = async (
  authorId: string,
  includeDeleted: boolean = false
) => {
  return prisma.article.findMany({
    where: {
      authorId,
      ...(includeDeleted ? {} : { deletedAt: null })
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const updateArticle = async (
  articleId: string,
  authorId: string,
  data: any
) => {
  const article = await prisma.article.findUnique({
    where: { id: articleId }
  });

  if (!article) {
    throw new Error("NotFound");
  }

  if (article.authorId !== authorId) {
    throw new Error("Forbidden");
  }

  return prisma.article.update({
    where: { id: articleId },
    data: {
      title: data.title,
      content: data.content,
      category: data.category,
      status: data.status
    }
  });
};

export const softDeleteArticle = async (
  articleId: string,
  authorId: string
) => {
  const article = await prisma.article.findUnique({
    where: { id: articleId }
  });

  if (!article) {
    throw new Error("NotFound");
  }

  if (article.authorId !== authorId) {
    throw new Error("Forbidden");
  }

  return prisma.article.update({
    where: { id: articleId },
    data: {
      deletedAt: new Date()
    }
  });
};