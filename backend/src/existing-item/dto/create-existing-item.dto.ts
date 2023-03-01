import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNumber, IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateStatDto } from 'src/stat/dto/create-stat.dto';
import { Type } from 'class-transformer';

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
  readonly published: boolean = false;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
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
  @IsString()
  readonly offerType: 'WTB' | 'WTS';
}
