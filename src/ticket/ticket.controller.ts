import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  LoggerService 
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AnalyticsDto, AnalyticsResponse } from './dto/analytics.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService) {}

  @Get('analytics')
  analytics(@Query() analyticsDto: AnalyticsDto): Promise<AnalyticsResponse[]> {
    return this.ticketService.analytics(analyticsDto);
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
