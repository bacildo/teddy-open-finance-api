import { ShortenedURL, UserEntity } from "../../entities";
import { Abstract } from "../abstract/abstract";
import { Database } from "../../initialization";
import { Service } from "typedi";
import { DeepPartial } from "typeorm";

@Service()
export class ShortenedURLRepository extends Abstract<ShortenedURL> {
  constructor() {
    super(Database.mysql, ShortenedURL);
  }

  async findByShortenedURLById(id: number): Promise<ShortenedURL | null> {
    try {
      const result = await this.mySqlRepository.findOne({
        where: { id: id },
        relations: ["user"],
      });
      return result;
    } catch (error) {
      throw new Error(`${error}, ShortenedURL not found`);
    }
  }

  async findByShortenedURL(shortUrl: string): Promise<ShortenedURL | null> {
    try {
      const result = await this.mySqlRepository.findOne({
        where: { short_url: shortUrl },
        relations: ["user"],
      });
      return result;
    } catch (error) {
      throw new Error(`${error}, ShortenedURL not found`);
    }
  }

  async findByOriginalURL(originalURL: string): Promise<ShortenedURL | null> {
    try {
      const result = await this.mySqlRepository.findOne({
        where: { url: originalURL },
        relations: ["user"],
      });
      return result;
    } catch (error) {
      throw new Error(`${error}, Original URL not found`);
    }
  }

  async deleteLogicalById(id: number): Promise<void> {
    try {
      const result = await this.mySqlRepository.update(id, {
        deletedAt: new Date(),
      });
      if (result.affected === 0) {
        throw new Error("ShortenedURL not deleted");
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async findByUser(user: UserEntity): Promise<ShortenedURL[]> {
    try {
      const result = await this.mySqlRepository.find({
        where: { user },
      });
      return result;
    } catch (error) {
      throw new Error(`${error}, ShortenedURLs not found`);
    }
  }

  async findUserById(userId: number): Promise<ShortenedURL | null> {
    try {
      const result = await this.mySqlRepository.findOne({
        where: { id: userId },
        relations: ["user"],
      });
      return result;
    } catch (error) {
      throw new Error(`${error}, ShortenedURL not found`);
    }
  }

  async deleteShortenedURL(id: number): Promise<void> {
    try {
      const result = await this.mySqlRepository.delete(id);
      if (result.affected === 0) {
        throw new Error("ShortenedURL not deleted");
      }
    } catch (error) {
      throw new Error(`${error}, ShortenedURL not deleted`);
    }
  }

  async updateShortenedURL(
    id: number,
    originalURL: string
  ): Promise<ShortenedURL> {
    try {
      const shortenedURL = await this.mySqlRepository.findOne({ where: { id: id } })
      if (!shortenedURL) {
        throw new Error("ShortenedURL not found");
      }
      shortenedURL.url = originalURL;
      await this.mySqlRepository.save(shortenedURL);
      return shortenedURL;
    } catch (error) {
      throw new Error(`${error}, Error updating ShortenedURL`);
    }
  }

  async createShortenedURL(
    data: DeepPartial<ShortenedURL>
  ): Promise<ShortenedURL> {
    const newShortenedURL = this.mySqlRepository.create({
      ...data,
      count_clicks: 0,
    });

    await this.save(newShortenedURL);
    return newShortenedURL;
  }
}
