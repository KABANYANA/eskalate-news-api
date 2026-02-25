jest.mock("../config/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    article: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    dailyAnalytics: {
      upsert: jest.fn(),
    },
    readLog: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));