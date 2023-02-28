import { PartialType } from '@nestjs/swagger';
import { CreateExistingItemDto } from './create-existing-item.dto';

export class UpdateExistingItemDto extends PartialType(CreateExistingItemDto) {}
