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
  IsInt,
} from 'class-validator';
import { CreateStatDto } from 'src/stat/dto/create-stat.dto';
import { Transform, Type } from 'class-transformer';

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
  @IsOptional()
  @Transform(
    ({ obj }) =>
      obj.discordNotification === 'true' || obj.discordNotification === true,
  )
  readonly discordNotification: boolean = false;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ obj }) => obj.published === 'true' || obj.published === true)
  readonly published: boolean = false;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @Max(9999)
  @Min(1)
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
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
