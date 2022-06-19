import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  create(createTicketDto: CreateTicketDto) {
    if (createTicketDto.creationDate === undefined) {
      const today = new Date();
      const date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();

      createTicketDto.creationDate = new Date(date);
    }

    return this.ticketsRepository.insert(createTicketDto);
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find();
  }

  findOne(id: number): Promise<Ticket> {
    return this.ticketsRepository.findOneBy({
      id: id,
    });
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    this.ticketsRepository.update({ id: id }, updateTicketDto);
    return `This action updates a #${id} ticket`;
  }

  async remove(id: number) {
    await this.ticketsRepository.delete(id);
    return `This action removes a #${id} ticket`;
  }
}
