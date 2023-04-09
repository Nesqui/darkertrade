import { Inject, Injectable } from '@nestjs/common';
import { Attribute } from './attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributeService {
  constructor(
    @Inject('ATTRIBUTES_REPOSITORY')
    private attributesRepository: typeof Attribute,
  ) {}

  create(createAttributeDto: CreateAttributeDto) {
    return 'This action adds a new attribute';
  }

  async findAll() {
    return await this.attributesRepository.findAll({
      order: ['name'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} attribute`;
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto) {
    const res = await this.attributesRepository.update(updateAttributeDto, {
      where: { id },
    });
    return res;
  }

  remove(id: number) {
    return `This action removes a #${id} attribute`;
  }
}
