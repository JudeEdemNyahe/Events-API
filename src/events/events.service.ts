import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { AttendeeResponseEnum } from './attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { paginate, PaginateOptions } from 'src/pagination/paginator';

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
  private async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`,
        );
      }

      if (filter.when == WhenEventFilter.Tommorrow) {
        query = query.andWhere(
          `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`,
        );
      }

      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
      }

      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere(
          'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1',
        );
      }
    }
    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
  }
  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
