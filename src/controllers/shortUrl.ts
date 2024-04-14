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
  QueryParam,
  Res,
  UseBefore,
} from "routing-controllers";
import { ShortenedURL, UserEntity } from "../entities/";
import { validateToken } from "../middleware/jwtVerify";
import { ShortenedURLService } from "../services";
import { Response } from "express";
import { Service } from "typedi";

@Service()
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

  @Get("/id/:id")
  @UseBefore(validateToken)
  async getShortenedURL(
    @Param("id") id: number,
    @CurrentUser() user: UserEntity
  ): Promise<ShortenedURL | null> {
    return this.shortenedURLService.getShortenedURLById(id);
  }
  @Get()
  async redirectToOriginalURL(
    @QueryParam("shortUrl") shortUrl: string,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const shortenedURL = await this.shortenedURLService.getShortenedURLByUrl(
        shortUrl
      );

      if (shortenedURL) {
        res.redirect(shortenedURL.url);
        await this.shortenedURLService.registerClick(shortenedURL.id);
      } else {
        res.status(404).send({ message: "URL not found" });
      }
    } catch (error) {
      return res.status(401).send({ message: "Error registering" });
    }
    return res;
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
