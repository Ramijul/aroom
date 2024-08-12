import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { UsersService } from './users/users.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

const JWT_OPTIONS = {
  secret: 'SOMEKINDASECRET',
  signOptions: {
    expiresIn: 2000,
  },
};

describe('AuthController', () => {
  let authController: AuthController;
  let usersService: DeepMocked<UsersService>;
  const userDocument = {
    _id: 'asda' as unknown as Types.ObjectId,
    email: 'test@email.com',
    password: 'ashdgaj',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register(JWT_OPTIONS)],
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: UsersService, useValue: createMock<UsersService>() },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    usersService = app.get(UsersService);
  });

  describe('login', () => {
    it('should return token"', async () => {
      const resp = await authController.login(userDocument);
      expect(resp).toHaveProperty('token');
    });

    it('should have the correct sub in the token"', async () => {
      const resp = await authController.login(userDocument);

      expect(new JwtService(JWT_OPTIONS).decode(resp.token)['sub']).toBe(
        userDocument._id,
      );
    });

    it('should sign up successfully"', async () => {
      usersService.create.mockImplementation((_: Record<string, any>) =>
        Promise.resolve(userDocument),
      );

      const resp = await authController.signup({
        email: userDocument.email,
        password: userDocument.password,
      });

      expect(resp).toStrictEqual({ _id: userDocument._id });
    });

    it('should throw an error when signing up with an existing email"', async () => {
      usersService.create.mockImplementation((_: Record<string, any>) => {
        throw new Error('Account already exists');
      });

      await expect(
        authController.signup({
          email: userDocument.email,
          password: userDocument.password,
        }),
      ).rejects.toThrow('Account already exists');
    });
  });
});
