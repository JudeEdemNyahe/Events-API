import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { AttendeeResponseEnum } from './attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { CreateEventDto } from './input/create-event.dto';
import { User } from 'src/auth/user.entity';
import { Event, PaginatedEvents } from './event.entity';
import { UpdateEventDto } from './input/update-event.dto';

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
  ): Promise<PaginatedEvents> {
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

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    console.log(user);
    return await this.eventsRepository.save({
      ...input,
      organizer: user,
      when: new Date(input.when),
    });
  }
  public async getEventsOrganizedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsOrganizedByUserIdQuery(userId),
      paginateOptions,
    );
  }
  public async updateEvent(
    event: Event,
    eventInput: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsRepository.save({
      ...event,
      ...eventInput,
      when: eventInput.when ? new Date(eventInput.when) : event.when,
    });
  }

  private getEventsOrganizedByUserIdQuery(userId: number) {
    return this.getEventsBaseQuery().where('e.organizerId = :userId', {
      userId,
    });
  }
}
