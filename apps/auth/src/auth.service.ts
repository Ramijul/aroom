import { Injectable } from '@nestjs/common';
import { User } from './users/users.schema';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { LoginResponseDto } from './users/dto/login-response.dto';
import { SignupResponseDto } from './users/dto/signup-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  getHello(): string {
    return 'Hello from Auth Service!';
  }

  async login(user: User): Promise<LoginResponseDto> {
    const tokenPayload = {
      sub: user._id,
    };

    const token = this.jwtService.sign(tokenPayload);

    return { token };
  }

  async signup(createUserDto: CreateUserDto): Promise<SignupResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return { _id: user._id };
  }
}
