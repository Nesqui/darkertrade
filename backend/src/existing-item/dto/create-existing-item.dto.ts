import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { CreateStatDto } from 'src/stat/dto/create-stat.dto';
import { Type } from 'class-transformer';

export type OfferType = 'WTB' | 'WTS';
export class CreateExistingItemDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  readonly itemId: number;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  readonly published: boolean = false;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @Max(9999)
  @Min(-9999)
  @IsNumber()
  readonly wantedPrice: number;

  @ApiProperty({
    type: [CreateStatDto],
    isArray: true,
  })
  @IsArray()
  @Type(() => CreateStatDto)
  readonly stats: CreateStatDto[];

  @ApiProperty({
    type: String,
  })
  @IsEnum(['WTB', 'WTS'])
  readonly offerType: OfferType;
}
