import { Inject, Injectable } from '@nestjs/common';
import { UpdateBaseStatDto } from './dto/update-baseStat.dto';
import { CreateBaseStatDto } from './dto/create-baseStat.dto';
import { BaseStat } from './base-stat.entity';

@Injectable()
export class BaseStatService {
  constructor(
    @Inject('BASE_STAT_REPOSITORY')
    private baseStatRepository: typeof BaseStat,
  ) {}

  create(createBaseStatDto: CreateBaseStatDto) {
    return 'This action adds a new Basestat';
  }

  findAll() {
    return `This action doesnt return all Basestat`;
  }

  findOne(id: number) {
    return `This action doesnt return ${id} Basestat`;
  }

  async findBaseStatsByItemId(itemId: number) {
    const res = await this.baseStatRepository.findAll({
      where: { itemId },
    });
    return res;
  }

  async update(id: number, updateBaseStatDto: UpdateBaseStatDto) {
    const res = await this.baseStatRepository.update(updateBaseStatDto, {
      where: { id },
    });
    return res;
  }

  remove(id: number) {
    return `This action removes a #${id} Basestat`;
  }
}
