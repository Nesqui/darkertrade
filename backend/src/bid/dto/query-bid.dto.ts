import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
import { Transform, Type } from 'class-transformer';

export type BidSortParam = [string, 'ABC' | 'DESC'];

export class QueryBidDto {
  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ obj }) => obj.mine === 'true' || obj.mine === true)
  mine: boolean;

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
  sort: BidSortParam[];

  @ApiProperty({
    type: String,
  })
  @IsString()
  offerType: 'WTS' | 'WTB';
}
