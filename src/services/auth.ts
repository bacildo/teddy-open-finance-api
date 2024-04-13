import jwt from "jsonwebtoken";
import { configSecret } from "../config";

import { Service } from 'typedi';
import { UserRepository } from '../repositories/';
import { sign } from 'jsonwebtoken';
import { UserEntity } from "../entities";

@Service()
export class AuthService {

  private userRepository: UserRepository;
  
  constructor() {
    this.userRepository = new UserRepository();
  }
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

  async login(body:UserEntity): Promise<string> {
    const user = await this.userRepository.findUserByCredentials(body.email );
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = await this.generateToken({ userId: user.id });
    return token;
  }
}

