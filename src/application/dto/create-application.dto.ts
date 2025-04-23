import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  jobId: number;

  @ApiPropertyOptional({ example: 'asdasdasdasdasdasdas' })
  @IsString()
  @IsNotEmpty()
  coverLetter: string;
}
