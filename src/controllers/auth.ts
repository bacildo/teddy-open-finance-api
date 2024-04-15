import 'reflect-metadata';
import { JsonController, Post, Body } from "routing-controllers";
import { Service } from "typedi";
import { AuthService } from "../services/";
import { UserEntity } from "../entities";

@JsonController("/auth")
@Service()
export class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  @Post("/login")
  async login(@Body() body: UserEntity): Promise<{ token: string }> {
    const token = await this.authService.login(body);
    return { token };
  }
}
