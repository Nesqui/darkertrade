import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  MaxLength,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateBaseStatDto {
  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @Min(-100)
  @Max(1000)
  itemId: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  attributeId: number;
}
