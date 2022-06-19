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

  async analytics(
    method: string,
    movieTitle: string,
    fromDate: string,
    toDate: string,
  ) {
    if (method === 'js-algo') {
      const tickets = await this.ticketsRepository.find();

      const ticketsToAnalyse = tickets
        .filter((movie) => movie.movieTitle == movieTitle)
        .filter(
          (movie) =>
            movie.creationDate.toString() >= fromDate &&
            movie.creationDate.toString() <= toDate,
        );

      const revenue = {};
      const footCount = {};

      let ticketMonth = undefined;
      ticketsToAnalyse.forEach((ticket) => {
        ticketMonth = new Date(ticket.creationDate).toLocaleString('default', {
          month: 'long',
        });
        revenue[ticketMonth] = (revenue[ticketMonth] || 0) + ticket.ticketPrice;
        footCount[ticketMonth] = (footCount[ticketMonth] || 0) + 1;
      });

      const revenueAnalytics = [];
      const footCountAnalytics = [];

      for (const month in revenue) {
        const profit = revenue[month];
        revenueAnalytics.push({ month: month, summaryProfit: profit });
      }

      for (const month in footCount) {
        const visit = footCount[month];
        footCountAnalytics.push({ month: month, summaryVisits: visit });
      }

      const analytics = {
        revenue: revenueAnalytics,
        visit: footCountAnalytics,
      };

      return analytics;
    } else if (method == 'db-aggregation') {
      console.log('todo');
    }
  }

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
