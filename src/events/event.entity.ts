import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  when: Date;
  @Column()
  address: string;
  //one to many--refere to event class
  @OneToMany(() => Attendee, (attendees) => attendees.event, {
    cascade: true,
  })
  attendees: Attendee[];

  attendeeCount?: number;
  attendeeRejected?: number;
  attendeeMaybe?: number;
  attendeeAccepted?: number;
}
