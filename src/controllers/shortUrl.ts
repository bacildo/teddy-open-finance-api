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
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { ShortenedURLEntity, UserEntity } from "../entities/";
import { validateToken } from "../middleware/jwtVerify";
import { ShortenedURLService } from "../services";
import { Response } from "express";
import { Service } from "typedi";
import { CustomRequest, ShortenUrlResponse } from "../interfaces";

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
    @Body() body: ShortenedURLEntity,
    @CurrentUser() user: UserEntity
  ): Promise<ShortenUrlResponse> {
    try {
      let userId: number | undefined = undefined;
      if (user) {
        userId = user.id;
      }
      const shortenedURL = await this.shortenedURLService.shortenURL(
        body.url,
        userId
      );
      const response: ShortenUrlResponse = {
        url: shortenedURL.url,
        short_url: shortenedURL.short_url,
        idUser: shortenedURL.user?.id ?? null,
      };
      return response;
    } catch (error) {
      throw new Error("Cant find shortened URL");
    }
  }
  @Get("/list")
  @UseBefore(validateToken)
  async getList(
    @Res() res: Response,
    @Req() req: CustomRequest
  ): Promise<Response> {
    try {
      const userIdToken = req.user?.id;
      if (!userIdToken) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      const getShortUrl = await this.shortenedURLService.getAllShortenURLData();
      if (!getShortUrl || !getShortUrl.length) {
        return res.status(404).send({
          message: "Shortened URLs not found",
        });
      }
      const userShortUrls = getShortUrl.filter(
        (shortenedURL) => shortenedURL.user?.id === userIdToken
      );
      const response = userShortUrls.map((shortenedURL) => ({
        count_clicks: shortenedURL.count_clicks,
        short_url: shortenedURL.short_url,
      }));
      return res.status(200).send({ response: response });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Can't get ShortUrl" });
    }
  }
  @Delete("/:id")
  @UseBefore(validateToken)
  async deleteShortenedURL(
    @Param("id") id: number,
    @Res() res: Response,
    @Req() req: CustomRequest
  ): Promise<Response> {
    try {
      const userIdToken = req.user?.id;
      const userId = await this.shortenedURLService.getShortenedURLById(id);
      if (!userIdToken) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      if (userIdToken && userId.user && userIdToken !== userId.user.id) {
        return res.status(403).send({ message: "Forbidden" });
      }
      await this.shortenedURLService.deleteShortenedURL(id);
      return res.send({ message: "Success!" });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Delete failed, already deleted!" });
    }
  }
  @Get()
  async redirectUrl(
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
      return res.status(401).send({ message: "Error on redirect!" });
    }
    return res;
  }

  @Put("/:id")
  @UseBefore(validateToken)
  async updateShortenedURL(
    @Param("id") id: number,
    @Body() body: ShortenedURLEntity,
    @Res() res: Response,
    @Req() req: CustomRequest
  ): Promise<Response> {
    try {
      const userIdToken = req.user?.id;
      const userId = await this.shortenedURLService.getShortenedURLById(id);
      if (!userIdToken) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      if (userIdToken !== userId.user.id) {
        return res.status(403).send({ message: "Forbidden" });
      }
      const updatedShortenURL =
        await this.shortenedURLService.updateShortenedURL(id, body);
      const updatedResponse = {
        url: updatedShortenURL.url,
        updatedAt: updatedShortenURL.updatedAt,
      };
      return res.status(200).send({
        message: "URL updated",
        updated: updatedResponse,
      });
    } catch (error) {
      return res.status(500).send({ message: "Update failed!" });
    }
  }
}
