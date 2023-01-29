import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import typeOrmConfig from './config/typeOrm.Config';
import typeOrmConfigProd from './config/typeOrm.Config.prod';

import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.model';
import { AttendeeService } from './events/attendees.service';
import { Attendee } from './events/attendee.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production'
          ? typeOrmConfig
          : typeOrmConfigProd,
    }),
    // TypeOrmModule.forFeature([Attendee, AttendeeService]),
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
