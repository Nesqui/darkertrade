import { Injectable } from '@nestjs/common';
import { CreatePgDto } from './dto/create-pg.dto';
import { UpdatePgDto } from './dto/update-pg.dto';

@Injectable()
export class PgService {
  create(createPgDto: CreatePgDto) {
    return 'This action adds a new pg';
  }

  findAll() {
    return `This action returns all pg`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pg`;
  }

  update(id: number, updatePgDto: UpdatePgDto) {
    return `This action updates a #${id} pg`;
  }

  remove(id: number) {
    return `This action removes a #${id} pg`;
  }
}
