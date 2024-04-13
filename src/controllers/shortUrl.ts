// ShortenedURLController.ts
import {
  JsonController,
  Post,
  Body,
  Authorized,
  Get,
  Delete,
  Param,
  Put,
  CurrentUser,
} from "routing-controllers";
import { ShortenedURLService } from "../services";
import { UserEntity } from "../entities/";
import { ShortenedURL } from "../entities/";

@JsonController("/shortenedURL")
export class ShortURLController {
  constructor(private readonly shortenedURLService: ShortenedURLService) {}

  @Post()
  @Authorized()
  async shortenURL(
    @Body() body: { originalURL: string },
    @CurrentUser() user: UserEntity
  ): Promise<ShortenedURL> {
    return this.shortenedURLService.shortenURL(body.originalURL, user.id);
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