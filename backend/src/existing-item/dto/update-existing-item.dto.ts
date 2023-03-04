import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateExistingItemDto {
  @ApiProperty({
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  readonly published: boolean;

  @ApiProperty({
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  readonly archived: boolean;
}
