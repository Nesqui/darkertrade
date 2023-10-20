import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Min, Max, IsInt } from 'class-validator';

export class UpdateOfferPairDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    type: Number,
  })
  @Min(0)
  @Max(5)
  @IsNumber()
  rarity: number;

  @ApiProperty({
    type: Number,
  })
  @Max(9999)
  @Min(1)
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  readonly wantedPrice: number;

  @ApiProperty({
    type: Number,
  })
  @Max(9999)
  @Min(1)
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  readonly quantity: number;
}
