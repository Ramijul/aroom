import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { IsDateAfterNow, IsDateAfterProperty } from './customValidators';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  @IsDateAfterNow({ message: 'startDate must be a future date' })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsDateAfterProperty('startDate', {
    message: 'endDate cannot be on or before startDate ',
  })
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}
