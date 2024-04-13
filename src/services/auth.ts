// import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { configSecret } from "../config";

import { Service } from 'typedi';
import { UserRepository } from '../repositories/';
import { sign } from 'jsonwebtoken';

@Service()
export class AuthService {

  constructor(private readonly userRepository: UserRepository) {}

  async generateToken(payload: object): Promise<string> {
    const token = sign(payload, configSecret, { expiresIn: '1h' });
    return token;
  }

  async verifyToken(token: string): Promise<object> {
    try {
      const decoded = jwt.verify(token, configSecret);
      return decoded as object;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findUserByCredentials(email, password );
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = await this.generateToken({ userId: user.id });
    return token;
  }
}

// import { UserRepository } from "../repositories/sql/user";

// export async function validateToken(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   const userRepository = new UserRepository();

//   const { authorization } = req.headers;
//   if (!authorization) {
//     res.status(401).send({ message: "Invalid token" });
//     return;
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
//     const decoded = jwt.verify(token, configSecret.secret) as {
//       id: string;
//     };
//     const user = await userRepository.findUserById(decoded.id);
//     if (!user) {
//       res.status(401).send({ message: "Invalid token" });
//       return;
//     }
//     res.locals.user = user;
//     next();
//   } catch (error) {
//     res.status(401).send({ message: "Invalid token" });
//   }
// // }
// export class AuthService {
//   static generateToken(payload: object): string {
//     return jwt.sign(payload, configSecret, { expiresIn: '1h' });
//   }

//   static verifyToken(token: string): object {
//     return jwt.verify(token, configSecret) as object;
//   }
// }