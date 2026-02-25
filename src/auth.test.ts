import request from "supertest";
import app from "./app";
import prisma from "./config/prisma";

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    it("should register a new user successfully", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "123",
        email: "john@example.com",
        role: "author",
      });

      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "Password@123",
          role: "author",
        });

      expect(response.status).toBe(201);
      expect(response.body.Success).toBe(true);
      expect(response.body.Object.email).toBe("john@example.com");
    });

    it("should return conflict if email already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "123",
        email: "john@example.com",
      });

      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "Password@123",
          role: "author",
        });

      expect(response.status).toBe(409);
      expect(response.body.Success).toBe(false);
    });
  });
});
