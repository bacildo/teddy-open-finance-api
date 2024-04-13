import { Service } from "typedi";
import { ShortenedURL } from "../entities/";
import { User } from "../entities/";
import { UserRepository } from "../repositories/";
import { ShortenedURLRepository } from "../repositories/";

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly shortenedURLRepository: ShortenedURLRepository
  ) {}

  async getShortenedURLsByUser(
    userId: number,
    user: User
  ): Promise<ShortenedURL[]> {
    // Verificar se o usuário solicitado é o mesmo que está autenticado
    if (user.id !== userId) {
      throw new Error("Unauthorized access");
    }

    // Buscar as URLs encurtadas do usuário
    const shortenedURLs = await this.shortenedURLRepository.find({
      where: { user },
    });
    return shortenedURLs;
  }
}
