import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterExistingItemDto {
  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  readonly userId?: number;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  readonly slot?: string;
}
