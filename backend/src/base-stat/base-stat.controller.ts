import { Controller } from '@nestjs/common';
import { BaseStatService } from './base-stat.service';

@Controller('base-stat')
export class BaseStatController {
  constructor(private readonly baseStatService: BaseStatService) {}
}
