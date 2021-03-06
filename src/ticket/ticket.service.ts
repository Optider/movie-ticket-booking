import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsDto, AnalyticsResponse } from './dto/analytics.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

// Declaring enums for the analytics route
enum FetchType {
  Profit = 'Profit',
  Visit = 'Visit',
}

// Declaring enums for the method type
enum MethodType {
  DbAggregation = 'db-aggregation',
  JsAlgorithm = 'js-algorithm',
}

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async analytics(analyticsDto: AnalyticsDto): Promise<AnalyticsResponse[]> {
    const { method, movieTitle, fromDate, toDate, fetch } = analyticsDto;

    if (method === MethodType.JsAlgorithm) {
      const tickets: Ticket[] = await this.ticketsRepository.find();

      const ticketsToAnalyse: Ticket[] = tickets
        .filter((movie) => movie.movieTitle == movieTitle)
        .filter(
          (movie) =>
            new Date(movie.creationDate) >= new Date(fromDate) &&
            new Date(movie.creationDate) <= new Date(toDate),
        );

      let ticketMonth: string = null;
      const analytics: AnalyticsResponse[] = [];

      if (fetch === FetchType.Profit) {
        const revenue = {};

        ticketsToAnalyse.forEach((ticket) => {
          ticketMonth = new Date(ticket.creationDate).toLocaleString(
            'default',
            {
              month: 'long',
            },
          );
          revenue[ticketMonth] =
            (revenue[ticketMonth] || 0) + ticket.ticketPrice;
        });
        
        let profit = null;
        for (const month in revenue) {
          profit = revenue[month];
          analytics.push({ month: month, summaryProfit: profit });
        }
      } else if (fetch === FetchType.Visit) {
        const footCount = {};

        ticketsToAnalyse.forEach((ticket) => {
          ticketMonth = new Date(ticket.creationDate).toLocaleString(
            'default',
            {
              month: 'long',
            },
          );
          footCount[ticketMonth] = (footCount[ticketMonth] || 0) + 1;
        });

        if (fetch == FetchType.Visit) {
          for (const month in footCount) {
            const visit = footCount[month];
            analytics.push({ month: month, summaryVisits: visit });
          }
        }
      }

      return analytics;
    } else if (method === MethodType.DbAggregation) {
      // Get the movie details, filtered out by movie and the dates
      let query = `
        SELECT
        MONTHNAME(creationDate) AS month,
      `;
      if (fetch == FetchType.Visit) {
        query += `COUNT(id) as summaryVisits`;
      } else if (fetch == FetchType.Profit) {
        query += `SUM(ticketPrice) as summaryProfit`;
      }

      query += `
        FROM
        ticket
        WHERE movieTitle = '${movieTitle}'
        AND DATE(creationDate) >= '${fromDate}'
        AND DATE(creationDate) <= '${toDate}'
        GROUP BY month  
      `;

      const query_data = await this.ticketsRepository.query(query);

      return query_data;
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
