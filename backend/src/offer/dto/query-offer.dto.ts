import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export type OfferSortParam = [string, 'ABC' | 'DESC'];

export class QueryOfferDto {
  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ obj }) => obj.hideMine === 'true' || obj.hideMine === true)
  hideMine: boolean;

  @ApiProperty({
    type: Number,
  })
  @Max(15)
  @Min(1)
  @IsNumber()
  limit: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  offset: number;

  @ApiProperty({
    type: [[String, String]],
    isArray: true,
  })
  // @IsArray()
  @IsOptional()
  sort: OfferSortParam[];

  @ApiProperty({
    type: String,
  })
  @IsString()
  offerType: 'WTS' | 'WTB';

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  itemId: number;
}
