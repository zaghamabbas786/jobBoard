import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, IsIn } from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: 'admin' })
  @IsOptional()
  @IsIn(['user', 'admin', 'employer'])
  role?: 'user' | 'admin' | 'employer';
}
