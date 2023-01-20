import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { AttendeeResponseEnum } from './attendee.entity';

@Injectable()
export class EventsService {
  private logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere('e.id=:id', {
      id,
    });

    this.logger.debug(query.getSql());
    return await query.getOne();
  }

  public getEventsWithAttendeeCountQuery() {
    const query = this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        //from entity table
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where(
            //mapped to attendee table
            'attendee.response = :response',
            { response: AttendeeResponseEnum.Accepted },
          ),
      )
      .loadRelationCountAndMap(
        //from entity table
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where(
            //mapped to attendee table
            'attendee.response = :response',
            { response: AttendeeResponseEnum.Maybe },
          ),
      )
      .loadRelationCountAndMap(
        //from entity table
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where(
            //mapped to attendee table
            'attendee.response = :response',
            { response: AttendeeResponseEnum.Rejected },
          ),
      );

    return query;
  }
}
