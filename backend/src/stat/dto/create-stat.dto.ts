import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Stat, StatSymbol } from 'src/stat/stat.entity';

export class CreateStatDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  readonly value: number;

  @ApiProperty({
    type: String,
  })
  readonly symbol: StatSymbol;

  @ApiProperty({
    type: String,
  })
  readonly attributeId: string;
}
