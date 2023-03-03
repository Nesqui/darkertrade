import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: typeof User,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByPk(id: number) {
    return await this.usersRepository.findByPk(id, {
      attributes: {
        exclude: ['password', 'discord'],
      },
    });
  }

  async findOne(user: QueryUserDto): Promise<User> | null {
    return await this.usersRepository.findOne({
      attributes: {
        exclude: ['discord'],
      },
      where: { ...user, active: true },
    });
  }

  async findByNickname(nickname: string) {
    return await this.usersRepository.findOne({
      where: { nickname, active: true },
      attributes: {
        exclude: ['password', 'discord'],
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
