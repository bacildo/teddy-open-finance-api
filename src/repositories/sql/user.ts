import { Service } from "typedi";
import { UserEntity } from "../../entities";
import { Database } from "../../initialization";
import { Abstract } from "../abstract/abstract";

@Service()
export class UserRepository extends Abstract<UserEntity> {
  constructor() {
    super(Database.mysql, UserEntity);
  }

  async findUserById(id: number): Promise<UserEntity> {
    try {
      const result = await this.mySqlRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new Error(`User with id ${id} not found`);
      }
      return result;
    } catch (error) {
      throw new Error(`${error}, User not found`);
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

  async updateUser(id: number, user: UserEntity): Promise<UserEntity> {
    try {
      const updatedUser = await this.mySqlRepository.update(
        {
          id: id,
        },
        user
      );

      if (!updatedUser || updatedUser.affected === 0) {
        throw new Error(`User with id ${id} not found`);
      }
      const result = new UserEntity();
      Object.assign(updatedUser, user);
      return result;
    } catch (error) {
      throw new Error(`${error}, User not updated`);
    }
  }

}
