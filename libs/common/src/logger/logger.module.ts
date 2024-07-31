import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const env: string = configService.get('NODE_ENV', 'dev');
        // disable pino-pretty in production
        return {
          pinoHttp:
            env.toLowerCase() !== 'production'
              ? {
                  transport: {
                    target: 'pino-pretty',
                    options: { singleLine: true },
                  },
                }
              : undefined,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}
