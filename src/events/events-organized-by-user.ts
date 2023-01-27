import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { SerializeOptions } from '@nestjs/common/serializer/decorators';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer/class-serializer.interceptor';

@Controller('events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('userId') userId: number, @Query('page') page = 1) {
    return await this.eventsService.getEventsOrganizedByUserIdPaginated(
      userId,
      { currentPage: page, limit: 5 },
    );
  }
}
