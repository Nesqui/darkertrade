import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateStatDto } from 'src/stat/dto/create-stat.dto';
import { Type } from 'class-transformer';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Column, ForeignKey, PrimaryKey } from 'sequelize-typescript';

export class CreateBidDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  readonly existingItemId: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  readonly suggestedExistingItemId: number;
}
