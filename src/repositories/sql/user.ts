import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { Service } from "typedi";
import { configSecret } from "../../config";
import { UserEntity } from "../../entities";
import { Database } from "../../initialization";
import { Abstract } from "../abstract/abstract";

@Service()
export class UserRepository extends Abstract<UserEntity> {
  constructor() {
    super(Database.mysql, UserEntity);
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    try {
      const result = await this.mySqlRepository.findOne({
        where: { id: id },
      });
      return result;
    } catch (error) {
      throw new Error(`${error}, User not found`);
    }
  }

  async generateToken(id: string): Promise<string> {
    try {
      const token = jwt.sign({ id }, configSecret, {
        expiresIn: 86400,
      });
      return token;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate token");
    }
  }

  async createAndSave(user: UserEntity): Promise<UserEntity> {
    try {
      const result = await this.mySqlRepository.save(user);
      return result;
    } catch (error) {
      throw new Error(`${error}, User not created`);
    }
  }

  async findUserByCredentials(email: string): Promise<UserEntity | null> {
    try {
      const result = await this.mySqlRepository.findOne({
        where: { email: email },
      });

      return result || null;
    } catch (error) {
      throw new Error(` Error to find, ${error}`);
    }
  }

  async editUser(id: string, user: UserEntity): Promise<UserEntity> {
    try {
      const updatedUser = await this.mongoRepository.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: user },
        { returnDocument: "after" }
      );
      if (!updatedUser || updatedUser.value === null) {
        throw new Error(`User with id ${id} not found`);
      }
      return updatedUser.value;
    } catch (error) {
      throw new Error(`${error}, User not updated`);
    }
  }

  async deleteUser(id: ObjectId): Promise<string | void> {
    try {
      const result = await this.mongoRepository.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        throw new Error(`User with id ${id} not found`);
      }
      return `User with id ${id} deleted successfully`;
    } catch (error) {
      throw new Error(`${error}, User not deleted`);
    }
  }
}
