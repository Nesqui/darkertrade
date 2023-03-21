import { ApiProperty } from '@nestjs/swagger';
import { Slot } from '../slot.entity';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { OfferType } from 'src/existing-item/dto/create-existing-item.dto';
import { Transform } from 'class-transformer';

export class QueryItemDto {
  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  slot: Slot;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsEnum(['WTB', 'WTS', ''])
  readonly offerType: OfferType;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ obj }) => obj.hideMine === 'true' || obj.hideMine === true)
  @IsOptional()
  hideMine: boolean;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => obj.published === 'true' || obj.published === true)
  published: boolean;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @Max(20)
  @IsOptional()
  limit: number;

  @ApiProperty({
    type: Number,
  })
  @Min(0)
  @IsNumber()
  @IsOptional()
  offset: number;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @MaxLength(25)
  searchItemString: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @MaxLength(25)
  searchExistingItemString: string;
}
