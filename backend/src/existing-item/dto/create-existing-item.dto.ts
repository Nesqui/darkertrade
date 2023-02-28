import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNumber, IsArray } from 'class-validator';
import { CreateStatDto } from 'src/stat/dto/create-stat.dto';
import { Type } from 'class-transformer';

export class CreateExistingItemDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  readonly itemId: number;

  @ApiProperty({
    type: [CreateStatDto],
    isArray: true,
  })
  @IsArray()
  @Type(() => CreateStatDto)
  readonly stats: CreateStatDto[];
}
