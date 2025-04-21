import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({ example: 'example@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '1234567' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
