import { Service } from "typedi";
import { DeepPartial } from "typeorm";
import { ShortenedURLEntity, UserEntity } from "../entities";
import { ShortenedURLRepository, UserRepository } from "../repositories";
import { shortUrlBase } from "../config/"

@Service()
export class ShortenedURLService {
  private shortenedURLRepository: ShortenedURLRepository;
  private userRepository: UserRepository;

  constructor() {
    this.shortenedURLRepository = new ShortenedURLRepository();
    this.userRepository = new UserRepository();
  }

  async findByShortenedURL(
    shortenedURL: string
  ): Promise<ShortenedURLEntity | null> {
    return this.shortenedURLRepository.findByShortenedURL(shortenedURL);
  }
  async registerClick(shortenedURLId: number): Promise<void> {
    await this.shortenedURLRepository.updateClicks(shortenedURLId);
  }

  async getAllShortenURLData():Promise <ShortenedURLEntity[]>{
    return await this.shortenedURLRepository.findAll();
  }

  async shortenURL(url: string, userId?: number): Promise<ShortenedURLEntity> {
    let user = null;
    if (userId) {
      user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
    }

    const shortenedURL = this.generateShortenedURL();
    const newShortenedURL = {
      url,
      short_url: shortenedURL,
      count_clicks: 0,
      user,
    };

    await this.shortenedURLRepository.createShortenedURL(
      newShortenedURL as DeepPartial<ShortenedURLEntity>
    );
    return newShortenedURL as unknown as ShortenedURLEntity;
  }

  private generateShortenedURL(): string {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let short_url = shortUrlBase;
    for (let i = 0; i < 6; i++) {
      short_url += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return short_url;
  }

  async getShortenedURLById(id: number): Promise<ShortenedURLEntity> {
    return this.shortenedURLRepository.findByShortenedURLById(id);
  }

  async getShortenedURLByUrl(
    shortUrl: string
  ): Promise<ShortenedURLEntity | null> {
    return this.shortenedURLRepository.findByShortenedURL(shortUrl);
  }

  async listShortenedURLs(user: UserEntity): Promise<ShortenedURLEntity[]> {
    return this.shortenedURLRepository.findByUser(user);
  }

  async deleteShortenedURL(id: number): Promise<void> {
    await this.shortenedURLRepository.deleteLogicalById(id);
  }

  async updateShortenedURL(
    id: number,
    body: ShortenedURLEntity
  ): Promise<ShortenedURLEntity> {
    return this.shortenedURLRepository.updateShortenedURL(id, body.url);
  }
}
