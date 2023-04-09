import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  MaxLength,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateBaseStatDto {}
