import { ShortenedURLEntity, UserEntity } from "../../entities";
import { Abstract } from "../abstract/abstract";
import { Database } from "../../initialization";
import { Service } from "typedi";
import { DeepPartial } from "typeorm";

@Service()
export class ShortenedURLRepository extends Abstract<ShortenedURLEntity> {
  constructor() {
    super(Database.mysql, ShortenedURLEntity);
  }

  async findByShortenedURLById(id: number): Promise<ShortenedURLEntity > {
    try {
      const result = await this.mySqlRepository.findOne({
        where: { id: id },
        relations: ["user"],
      });
      if (!result || result.deletedAt) {
        throw new Error("Not found record");
      }
      return result;
    } catch (error) {
      throw new Error(`${error}, ShortenedURL`);
    }
  }

  async findByShortenedURL(shortUrl: string): Promise<ShortenedURLEntity | null> {
    try {
      const result = await this.mySqlRepository.findOne({
        where: { short_url: shortUrl },
      });
      return result;
    } catch (error) {
      throw new Error(`${error}, ShortenedURL not found`);
    }
  }

  async updateClicks(shortenedURLId: number): Promise<void> {
    const shortenedURL = await this.mySqlRepository.findOne({
      where: { id: shortenedURLId },
    });
    if (!shortenedURL) {
      throw new Error("Shortened URL not found");
    }
    shortenedURL.count_clicks++;
    await this.mySqlRepository.save(shortenedURL);
  }

  async findByOriginalURL(originalURL: string): Promise<ShortenedURLEntity | null> {
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
      const exists = await this.mySqlRepository.findOne({
        where: { id },
      });
      if (!exists) {
        throw new Error("ShortenedURL not found");
      }

      const result = await this.mySqlRepository.update(id, {
        deletedAt: new Date(),
      });
      if (!result || !result.affected || result.affected === 0) {
        throw new Error("ShortenedURL not deleted");
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async findByUser(user: UserEntity): Promise<ShortenedURLEntity[]> {
    try {
      const result = await this.mySqlRepository.find({
        where: { user: { id: user.id } },
      });
      return result;
    } catch (error) {
      throw new Error(`${error}, ShortenedURLs not found`);
    }
  }

  async findUserById(userId: number): Promise<ShortenedURLEntity | null> {
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

  async registerClick(shortenedURLId: string): Promise<ShortenedURLEntity> {
    const shortenedURL = await this.mySqlRepository.findOne({
      where: { short_url: shortenedURLId },
    });
    if (!shortenedURL) {
      throw new Error("Shortened URL not found");
    }

    shortenedURL.count_clicks++;
    return await shortenedURL.save();
  }


  async updateShortenedURL(
    id: number,
    url: string
  ): Promise<ShortenedURLEntity> {
    try {
      const shortenedURL = await this.mySqlRepository.findOne({
        where: { id: id },
      });
      if (!shortenedURL) {
        throw new Error("ShortenedURL not found");
      }
      shortenedURL.url = url;
      await this.mySqlRepository.save(shortenedURL);
      return shortenedURL;
    } catch (error) {
      throw new Error(`${error}, Error updating ShortenedURL`);
    }
  }

  async createShortenedURL(
    data: DeepPartial<ShortenedURLEntity>
  ): Promise<ShortenedURLEntity> {
    const newShortenedURL = this.mySqlRepository.create({
      ...data,
      count_clicks: 0,
    });

    await this.save(newShortenedURL);
    return newShortenedURL;
  }
}
