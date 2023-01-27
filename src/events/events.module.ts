import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { AttendeeService } from './attendees.service';
import { EventAttendeesController } from './event-attendees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController, EventAttendeesController],
  providers: [EventsService, AttendeeService],
})
export class EventsModule {}
