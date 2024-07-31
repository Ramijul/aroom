import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthCheckController {
  @Get()
  hello() {
    return 'Hello from Auth Service!';
  }
}
