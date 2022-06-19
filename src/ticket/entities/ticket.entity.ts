import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  // @CreateDateColumn()
  @Column({ type: 'date' })
  creationDate?: Date;

  @Column()
  customerName: string;

  @Column()
  movieTitle: string;

  @Column('time')
  movieTime: string;

  @Column()
  ticketPrice: number;
}
