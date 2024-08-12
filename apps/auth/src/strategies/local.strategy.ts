import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { PasswordExcludedUserDocument, User } from '../users/users.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<PasswordExcludedUserDocument> {
    try {
      return await this.usersService.verifyAndGetUser(email, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
