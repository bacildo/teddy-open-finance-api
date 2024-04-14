import { Service } from "typedi";
import { ShortenedURL } from "../entities";
import { ShortenedURLRepository } from "../repositories";
import { UserRepository } from "../repositories";
import { UserEntity } from "../entities";
import { DeepPartial } from "typeorm";

@Service()
export class ShortenedURLService {
  private shortenedURLRepository: ShortenedURLRepository;
  private userRepository: UserRepository;

  constructor() {
    this.shortenedURLRepository = new ShortenedURLRepository();
    this.userRepository = new UserRepository();
  }

  async findByShortenedURL(shortenedURL: string): Promise<ShortenedURL | null> {
    return this.shortenedURLRepository.findByShortenedURL(shortenedURL);
  }
  async registerClick(shortenedURLId: number): Promise<void> {
    await this.shortenedURLRepository.updateClicks(shortenedURLId);
  }

  async shortenURL(url: string, userId?: number): Promise<ShortenedURL> {
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
      newShortenedURL as DeepPartial<ShortenedURL>
    );
    return newShortenedURL as unknown as ShortenedURL;
  }

  private generateShortenedURL(): string {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let short_url = "http://localhost/";
    for (let i = 0; i < 6; i++) {
      short_url += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return short_url;
  }

  async getShortenedURLById(id: number): Promise<ShortenedURL | null> {
    return this.shortenedURLRepository.findByShortenedURLById(id);
  }

  async getShortenedURLByUrl(shortUrl: string): Promise<ShortenedURL | null> {
    return this.shortenedURLRepository.findByShortenedURL(shortUrl);
  }

  async listShortenedURLs(user: UserEntity): Promise<ShortenedURL[]> {
    return this.shortenedURLRepository.findByUser(user);
  }

  async deleteShortenedURL(id: number): Promise<void> {
    await this.shortenedURLRepository.deleteLogicalById(id);
  }

  async updateShortenedURL(
    id: number,
    originalURL: string,
    user: UserEntity
  ): Promise<ShortenedURL> {
    return this.shortenedURLRepository.updateShortenedURL(id, originalURL);
  }
}
