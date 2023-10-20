import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class AcceptOfferPairDto {
  @ApiProperty({
    type: Number,
  })
  @Min(1)
  @Max(9999)
  @IsNumber()
  quantity: number;
}
