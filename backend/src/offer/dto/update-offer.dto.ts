import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOfferDto } from './create-offer.dto';
import { IsString, IsNumber } from 'class-validator';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
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
