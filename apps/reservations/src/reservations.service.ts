import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly resersvationsRepository: ReservationsRepository,
  ) {}

  create(createReservationDto: CreateReservationDto) {
    return this.resersvationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId: '123',
    });
  }

  findAll() {
    return this.resersvationsRepository.find({});
  }

  findOne(_id: string) {
    return this.resersvationsRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.resersvationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.resersvationsRepository.findOneAndDelete({ _id });
  }
}
