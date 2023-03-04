import { ApiProperty } from '@nestjs/swagger';
import { Slot } from '../slot.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OfferType } from 'src/existing-item/dto/create-existing-item.dto';

export class QueryItemDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  slot: Slot;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsEnum(['WTB', 'WTS'])
  readonly offerType: OfferType;
}
