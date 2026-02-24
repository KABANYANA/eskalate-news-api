import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { validateSignup } from "../validators/auth.validator";
import { successResponse, errorResponse } from "../utils/response";

export const signup = async (req: Request, res: Response) => {
  try {
    const normalizedBody = {
      name: req.body.name?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      password: req.body.password,
      role: req.body.role?.trim()
    };

    const errors = validateSignup(normalizedBody);

    if (errors.length > 0) {
      return res.status(400).json(
        errorResponse("Validation failed", errors)
      );
    }

    const user = await registerUser(normalizedBody);

    return res.status(201).json(
      successResponse("User registered successfully", {
        id: user.id,
        email: user.email,
        role: user.role
      })
    );
  } catch (error: any) {
    if (error.message === "Email already exists") {
      return res.status(409).json(
        errorResponse("Conflict", ["Email already exists"])
      );
    }

    return res.status(500).json(
      errorResponse("Internal server error", [])
    );
  }
};