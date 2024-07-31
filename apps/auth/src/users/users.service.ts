import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.respository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRespository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = this.usersRespository.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    return this.usersRespository.create(createUserDto);
  }
}
