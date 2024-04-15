import "reflect-metadata";
import { Service } from "typedi";
import { UserEntity } from "../entities/";
import { UserRepository } from "../repositories/";
import { createHash } from "crypto";

@Service()
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
  async createUser(body: UserEntity): Promise<UserEntity> {
    const hashPassword = encryptPassword(body.password);
    const verifyUser = await this.userRepository.findUserByCredentials(
      body.email
    );
    if (verifyUser) throw new Error("User already exists!");
    const newUser = await this.userRepository.createAndSave({
      email: body.email,
      password: hashPassword,
    } as UserEntity);
    return newUser;
  }

  async findUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findUserById(id);
  }

  async updateUser(id: number, user: UserEntity): Promise<UserEntity> {
    if (user.password) {
      user.password = encryptPassword(user.password);
    }
    await this.userRepository.updateUser(id, user);
    const updatedUser = await this.userRepository.findUserById(id);
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }
}
function encryptPassword(password: string): string {
  const hash = createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}
