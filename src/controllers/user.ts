// UserController.ts
import {
  Authorized,
  CurrentUser,
  Get,
  JsonController,
  Param,
} from "routing-controllers";
import { Service } from "typedi";
import { UserEntity } from "../entities/";
import { UserService } from "../services/";
import { ShortenedURL } from '../entities/';

@JsonController("/user")
@Service()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id/shortenedURLs")
  @Authorized()
  async getShortenedURLs(
    @Param("id") id: number,
    @CurrentUser() user: UserEntity
  ): Promise<ShortenedURL[]> {
    return this.userService.getShortenedURLsByUser(id, user);
  }
}
