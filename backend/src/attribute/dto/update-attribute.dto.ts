import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
  Max,
} from 'class-validator';
import { CreateAttributeDto } from './create-attribute.dto';

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {
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
    type: String,
  })
  @IsOptional()
  @MinLength(0)
  @MaxLength(90)
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @MinLength(0)
  @MaxLength(90)
  @IsString()
  symbol: string;
}
