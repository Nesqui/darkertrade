import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class QueryUserDto {
  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @MinLength(0)
  @MaxLength(50)
  @IsString()
  nickname?: string;

  @ApiProperty({
    type: String,
  })
  @MinLength(0)
  @MaxLength(90)
  @IsOptional()
  @IsString()
  password?: string;
}
