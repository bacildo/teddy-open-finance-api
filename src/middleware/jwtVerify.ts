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
    return next();
  }

  const parts = authorization.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    res.status(401).send({ message: "Invalid token" });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, configSecret) as { userId: number };

    const user = await userRepository.findUserById(decoded.userId);
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

// export async function validateToken(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   const userRepository = new UserRepository();

//   const { authorization } = req.headers;
//   if (!authorization) {
//     // res.status(401).send({ message: "Invalid token" });
//     return next()
//   }
//   const parts = authorization?.split(" ");
//   if (parts?.length !== 2) {
//     res.status(401).send({ message: "Invalid token" });
//     return;
//   }
//   const [schema, token] = parts;
//   if (!/^Bearer$/i.test(schema)) {
//     res.status(401).send({ message: "Invalid token" });
//     return;
//   }
//   try {
//     const decoded = jwt.verify(token, configSecret) as {
//       userId: number;
//     };
//     const user = await userRepository.findUserById(decoded.userId);
//     if (!user) {
//       res.status(401).send({ message: "Invalid token" });
//       return;
//     }
//     req.body = user.id;
//     next();
//   } catch (error) {
//     res.status(401).send({ message: "Invalid token" });
//   }
// }
