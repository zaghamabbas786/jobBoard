import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateJobDto {
  @ApiPropertyOptional({ example: 'title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'asdasdas   asd as d sa d as d as' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'secraminto california' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: '5000 $' })
  @IsString()
  @IsOptional()
  salary?: string;
}
