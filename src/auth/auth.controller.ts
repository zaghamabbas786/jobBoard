import { Controller, Post, Body, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // DTO for login
import { RegisterDto } from './dto/register.dto'; // DTO for registration

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login route - takes email and password, returns access_token
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    return this.authService.login(user); // Return the JWT token
  }

  // Register route - allows users to register with an email and password
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto?.email, registerDto?.password);
  }
}
