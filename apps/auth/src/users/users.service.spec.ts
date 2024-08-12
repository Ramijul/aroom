import { Test, TestingModule } from '@nestjs/testing';
import { SALT_ROUNDS, UsersService } from './users.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UsersRepository } from './users.respository';
import { CreateUserDto } from './dto/create-user.dto';
import { Types } from 'mongoose';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: DeepMocked<UsersRepository>;
  const userDto = { email: 'a@b.com', password: 'asdasdad' };
  const userId = 'asda';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: createMock<UsersRepository>() },
      ],
    }).compile();

    service = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return a new document', async () => {
    usersRepository.findOne.mockImplementation((_: Record<string, any>) => {
      throw new Error('Document ');
    });

    usersRepository.create.mockImplementation(
      (document: Omit<User, '_id'>): Promise<User> =>
        Promise.resolve({
          _id: userId as unknown as Types.ObjectId,
          ...document,
        }),
    );
    const userDoc = await service.create(userDto);

    expect(userDoc._id.toString()).toBe(userId);
  });

  it('should throw error when creating user with an existing email', async () => {
    usersRepository.findOne.mockImplementation((filter: Record<string, any>) =>
      Promise.resolve({
        _id: userId as unknown as Types.ObjectId,
        ...userDto,
      }),
    );

    await expect(service.create(userDto)).rejects.toThrow(
      'Account already exists',
    );
  });

  it('should return a verified user', async () => {
    usersRepository.findOne.mockImplementation(
      async (filter: Record<string, any>): Promise<User> =>
        Promise.resolve({
          _id: userId as unknown as Types.ObjectId,
          email: filter.email,
          password: await bcrypt.hash(userDto.password, SALT_ROUNDS),
        }),
    );
    const userDoc = await service.verifyAndGetUser(
      userDto.email,
      userDto.password,
    );
    expect(userDoc._id.toString()).toBe(userId);
  });

  it('should throw UnauthorizedException for wrong credentials', async () => {
    usersRepository.findOne.mockImplementation(
      async (filter: Record<string, any>): Promise<User> =>
        Promise.resolve({
          _id: userId as unknown as Types.ObjectId,
          email: filter.email,
          password: await bcrypt.hash('adifferentpassword', SALT_ROUNDS),
        }),
    );

    await expect(
      service.verifyAndGetUser(userDto.email, userDto.password),
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      service.verifyAndGetUser(userDto.email, userDto.password),
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw UnauthorizedException for non existing email', async () => {
    usersRepository.findOne.mockImplementation(
      async (_: Record<string, any>): Promise<User> => {
        throw new Error('Document not found');
      },
    );

    await expect(
      service.verifyAndGetUser(userDto.email, userDto.password),
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      service.verifyAndGetUser(userDto.email, userDto.password),
    ).rejects.toThrow('Invalid credentials');
  });
});
