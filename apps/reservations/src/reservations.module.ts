import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { Reservation, ReservationSchema } from './models/reservation.schema';
import { HealthCheckController } from './healthcheck.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().optional().integer().min(3000).allow(null),
        NODE_ENV: Joi.string()
          .valid('dev', 'production')
          .optional()
          .allow(null),
      }),
    }),
  ],
  controllers: [ReservationsController, HealthCheckController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
