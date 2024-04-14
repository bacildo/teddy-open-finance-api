import {
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

  @Get("/:id")
  @UseBefore(validateToken)
  async getShortenedURL(
    @Param("id") id: number,
    @Res() res: Response
    // @CurrentUser() user: UserEntity
  ): Promise<ShortenedURL | null> {
    try {
      return this.shortenedURLService.getShortenedURLById(id);
    } catch (error) {
      return null;
    }
  }

  @Delete("/:id")
  @UseBefore(validateToken)
  async deleteShortenedURL(
    @Param("id") id: number,
    @Res() res: Response
  ): Promise<Response> {
    try {
      await this.shortenedURLService.deleteShortenedURL(id);
      return res.send({ message: "Success!" });
    } catch (error) {
      return res.status(500).send({ message: "Delete failed!" });
    }
  }

  @Get()
  async countURLClicks(
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
      return res.status(401).send({ message: "Error on count clicks!" });
    }
    return res;
  }

  @Get("/:list")
  @UseBefore(validateToken)
  async listShortenedURLs(user: UserEntity): Promise<ShortenedURL[]> {
    return this.shortenedURLService.listShortenedURLs(user);
  }

  @Put("/:id")
  @UseBefore(validateToken)
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
