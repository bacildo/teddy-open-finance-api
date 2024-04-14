import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore,
} from "routing-controllers";
import { ShortenedURL, UserEntity } from "../entities/";
import { validateToken } from "../middleware/jwtVerify";
import { ShortenedURLService } from "../services";

@JsonController("/shortenedURL")
export class ShortURLController {
  private shortenedURLService: ShortenedURLService;
  constructor() {
    this.shortenedURLService = new ShortenedURLService();
  }

  @Post()
  @UseBefore(validateToken)
  async shortenURL(
    @Body() body: ShortenedURL,
    @CurrentUser() user: UserEntity
  ): Promise<ShortenedURL> {
    let userId: number | undefined = undefined;
  if (user) {
    userId = user.id;
  }

    return this.shortenedURLService.shortenURL(body.url, userId);
  }

  @Get("/:id")
  @Authorized()
  async getShortenedURL(
    @Param("id") id: number,
    @CurrentUser() user: UserEntity
  ): Promise<ShortenedURL | null> {
    return this.shortenedURLService.getShortenedURLById(id);
  }

  @Get()
  @Authorized()
  async listShortenedURLs(
    @CurrentUser() user: UserEntity
  ): Promise<ShortenedURL[]> {
    return this.shortenedURLService.listShortenedURLs(user);
  }

  @Delete("/:id")
  @Authorized()
  async deleteShortenedURL(
    @Param("id") id: number,
    @CurrentUser() user: UserEntity
  ): Promise<void> {
    await this.shortenedURLService.deleteShortenedURL(id);
  }

  @Put("/:id")
  @Authorized()
  async updateShortenedURL(
    @Param("id") id: number,
    @Body() body: { originalURL: string },
    @CurrentUser() user: UserEntity
  ): Promise<ShortenedURL> {
    return this.shortenedURLService.updateShortenedURL(
      id,
      body.originalURL,
      user
    );
  }
}
