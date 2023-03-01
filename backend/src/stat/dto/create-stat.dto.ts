import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateStatDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  readonly value: number;

  @ApiProperty({
    type: String,
  })
  readonly attributeId: string;
}
