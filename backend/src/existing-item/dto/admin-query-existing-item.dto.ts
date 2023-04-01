import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AdminQueryExistingItemDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  limit: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  offset: number;
}
