import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { HealthCheckController } from './healthcheck.controller';
import { LoggerModule } from '@app/common';

@Module({
  imports: [UsersModule, LoggerModule],
  controllers: [AuthController, HealthCheckController],
  providers: [AuthService],
})
export class AuthModule {}
