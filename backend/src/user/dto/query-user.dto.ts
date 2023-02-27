import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  nickname?: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  password?: string;
}
