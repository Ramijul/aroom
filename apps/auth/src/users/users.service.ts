import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.respository';
import * as bcrypt from 'bcrypt';
import { PasswordExcludedUserDocument, User } from './users.schema';
import { Types } from 'mongoose';

export const SALT_ROUNDS = 10;
@Injectable()
export class UsersService {
  constructor(private readonly usersRespository: UsersRepository) {}

  private excludePasswordFromUserDocument(
    userDocument: User,
  ): PasswordExcludedUserDocument {
    const document = { ...userDocument };
    delete document.password;

    return document;
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<PasswordExcludedUserDocument> {
    try {
      await this.usersRespository.findOne({
        email: createUserDto.email,
      });
    } catch (e) {
      // create user, account does not exist
      return this.excludePasswordFromUserDocument(
        await this.usersRespository.create({
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, SALT_ROUNDS),
        }),
      );
    }

    throw new Error('Account already exists');
  }

  async verifyAndGetUser(
    email: string,
    password: string,
  ): Promise<PasswordExcludedUserDocument> {
    let user: User;
    try {
      user = await this.usersRespository.findOne({
        email: email,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.excludePasswordFromUserDocument(user);
  }
}
