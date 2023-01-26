import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

export enum AttendeeResponseEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: true,
  })
  @JoinColumn()
  event: Event;

  @Column('enum', {
    enum: AttendeeResponseEnum,
    default: AttendeeResponseEnum.Accepted,
  })
  @Expose()
  response: AttendeeResponseEnum;
}
