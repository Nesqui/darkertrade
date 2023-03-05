import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';

export class CreateStatDto {
  @ApiProperty({
    type: Number,
  })
  @MaxLength(4)
  @Max(200)
  @Min(-200)
  @IsNumber()
  readonly value: number;

  @ApiProperty({
    type: String,
  })
  readonly attributeId: string;
}
