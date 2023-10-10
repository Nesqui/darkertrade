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

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => obj.isBase === 'true' || obj.isBase === true)
  readonly isBase: boolean = false;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(
    ({ obj }) => obj.isApproximately === 'true' || obj.isApproximately === true,
  )
  readonly isApproximately: boolean = false;
}
