import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  @IsString()
  nickname: string;

  @ApiProperty({
    type: String,
  })
  @MinLength(1)
  @MaxLength(90)
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
  })
  @MinLength(0)
  @MaxLength(90)
  @IsString()
  hash: string;
}
