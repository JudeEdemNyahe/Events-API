import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from '../auth/user.entity';

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
  @Column()
  eventId: number;
  @Column('enum', {
    enum: AttendeeResponseEnum,
    default: AttendeeResponseEnum.Accepted,
  })
  @Expose()
  response: AttendeeResponseEnum;
  @ManyToOne(() => User, (user) => user.attended)
  user: User;
  @Column()
  userId: number;
}
