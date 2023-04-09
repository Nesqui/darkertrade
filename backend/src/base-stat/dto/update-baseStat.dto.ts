import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateBaseStatDto } from './create-baseStat.dto';

export class UpdateBaseStatDto extends PartialType(CreateBaseStatDto) {
  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @Min(-100)
  @Max(100)
  min: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @Min(-100)
  @Max(100)
  max: number;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(
    ({ obj }) => obj.inputRequired === 'true' || obj.inputRequired === true,
  )
  inputRequired: boolean;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  attributeId: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @Min(-100)
  @Max(100)
  statsLength: number;
}
