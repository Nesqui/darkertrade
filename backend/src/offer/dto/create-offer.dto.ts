import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { CreateOfferPairDto } from './create-offer-pair.dto';

export class CreateOfferDto {
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

  @ApiProperty({
    type: [CreateOfferPairDto],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1) // Минимальное количество элементов в массиве (может быть другим)
  @ArrayMaxSize(30) // Максимальное количество элементов в массиве (может быть другим)
  @ValidateNested({ each: true })
  @Type(() => CreateOfferPairDto)
  readonly offerPairs: CreateOfferPairDto[];
}
