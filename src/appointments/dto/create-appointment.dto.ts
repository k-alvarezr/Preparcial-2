import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  datetime: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
