import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userSerice: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string) {
    const user = await this.userSerice.findByEmail(email);
    console.log(pass)

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
   
      return result;
    }
    throw new UnauthorizedException();
  }
  async login(user: any) {
   

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(email?: string, password?: string): Promise<User> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userSerice.createUser({
      email,
      password: hashedPassword,
      role: 'user',
    });
  }
}
