import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ReservationsRepository } from './reservations.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Types } from 'mongoose';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let repository: DeepMocked<ReservationsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: ReservationsRepository,
          useValue: createMock<ReservationsRepository>(),
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    repository = module.get(ReservationsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call create once'){
    const reservation = {
    "startDate": "2024-05-28",
    "endDate": "2024-05-30",
    "placeId": "12343",
    "invoiceId": "498",
    "extra": "value"
}
    repository.create.mockImplementation((createDto: CreateReservationDto) => Promise.resolve({
        ...createDto,
        _id: "asd" as unknown as Types.ObjectId
      }
    ))
  }
});
