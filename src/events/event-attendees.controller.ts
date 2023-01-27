import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { AttendeeService } from './attendees.service';
import { SerializeOptions } from '@nestjs/common/serializer/decorators';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer/class-serializer.interceptor';

@Controller('events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {
  constructor(private readonly attendeesService: AttendeeService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('eventId') eventId: number) {
    return await this.attendeesService.findByEventId(eventId);
  }
}
