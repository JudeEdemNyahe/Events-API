import { IsEnum } from 'class-validator';
import { AttendeeResponseEnum } from '../attendee.entity';

export class CreateAttendeeDto {
  @IsEnum(AttendeeResponseEnum)
  response: AttendeeResponseEnum;
}
