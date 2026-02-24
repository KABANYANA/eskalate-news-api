export interface CreateArticleInput {
  title: string;
  content: string;
  category: string;
  status?: "Draft" | "Published";
}

export const validateArticle = (data: CreateArticleInput): string[] => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 1 || data.title.length > 150) {
    errors.push("Title must be between 1 and 150 characters.");
  }

  if (!data.content || data.content.length < 50) {
    errors.push("Content must be at least 50 characters long.");
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push("Category is required.");
  }

  if (data.status && !["Draft", "Published"].includes(data.status)) {
    errors.push("Status must be either 'Draft' or 'Published'.");
  }

  return errors;
};