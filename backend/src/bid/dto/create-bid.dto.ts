import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBidDto {
  @ApiProperty({
    type: Number,
  })
  @Max(9999)
  @Min(1)
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  readonly price: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  readonly existingItemId: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  readonly suggestedExistingItemId: number;
}
