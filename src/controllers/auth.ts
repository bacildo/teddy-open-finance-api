import { JsonController, Post, Body } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthService } from '../services/';

@JsonController('/auth')
@Service()
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: { email: string, password: string }): Promise<{ token: string }> {
    const { email, password } = body;
    const token = await this.authService.login(email, password);
    return { token };
  }
}
