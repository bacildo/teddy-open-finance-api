// middleware/validateToken.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { configSecret } from "../config";
import { UserRepository } from "../repositories/";
import { CustomRequest } from "../interfaces/";

export async function validateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userRepository = new UserRepository();

  const { authorization } = req.headers;
  if (!authorization) {
    // Se não houver autorização, continua sem interromper
    return next();
  }

  const parts = authorization.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    res.status(401).send({ message: "Invalid token" });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, configSecret) as { id: number };
    const user = await userRepository.findUserById(decoded.id);
    if (!user) {
      res.status(401).send({ message: "Invalid token" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: "Invalid token" });
  }
}
