// UserController.ts
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { ShortenedURL, UserEntity } from "../entities/";
import { validateToken } from "../middleware/jwtVerify";
import { UserService } from "../services/";

@Service()
@JsonController("/user")
export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  @Get("/:id/shortenedURLs")
  @UseBefore(validateToken)
  async getShortenedURLs(
    @Param("id") id: number,
    @CurrentUser() user: UserEntity
  ): Promise<ShortenedURL[]> {
    return this.userService.getShortenedURLsByUser(id, user);
  }
  @Post("/register")
  async createUser(@Body() user: UserEntity): Promise<UserEntity> {
    if (Object.keys(user).length == 0) {
      throw new Error("Please inform the user data");
    } else {
      return await this.userService.createUser(user);
    }
  }
}
