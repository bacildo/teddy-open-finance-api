import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Res,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { ShortenedURLEntity, UserEntity } from "../entities/";
import { validateToken } from "../middleware/jwtVerify";
import { UserService } from "../services/";
import { Response } from "express";

@Service()
@JsonController("/user")
export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  @Get("/:id")
  @UseBefore(validateToken)
  async getShortenedURLs(
    @Param("id") id: number,
    @CurrentUser() user: UserEntity
  ): Promise<ShortenedURLEntity[]> {
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
  @Put("/:id")
  async updateUser(
    @Param("id") id: number,
    @Body() user: UserEntity,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const updatedUser = await this.userService.updateUser(id, user);
      const updatedResponse = {
        email: updatedUser.email,
        password: updatedUser.password,
        updatedAt: updatedUser.updatedAt,
      };
      return res.status(200).send({
        message: "User updated successfully",
        updated: updatedResponse,
      });
    } catch (error) {
      return res.status(500).send({ message: "Error updating user" });
    }
  }
}
