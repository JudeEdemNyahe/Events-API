import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from './attendee.entity';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(AttendeeService)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public async findByEventId(eventId: number): Promise<Attendee[]> {
    //all attendees that attend a particular event
    return await this.attendeeRepository.find({
      where: {
        event: { id: eventId },
      },
    });
  }
}
