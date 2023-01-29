import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { EventAttendeesController } from './event-attendees.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { AttendeeService } from './attendees.service';
import { EventsOrganizedByUserController } from './events-organized-by-user';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    CurrentUserEventAttendanceController,
    EventAttendeesController,
    EventsOrganizedByUserController,
  ],
  providers: [EventsService, AttendeeService],
})
export class EventsModule {}
