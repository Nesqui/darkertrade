import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AdminQueryUserDto {
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
