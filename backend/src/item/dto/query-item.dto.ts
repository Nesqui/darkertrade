import { ApiProperty } from '@nestjs/swagger';
import { Slot } from '../slot.entity';
import { IsString } from 'class-validator';

export class QueryItemDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  slot: Slot;
}
