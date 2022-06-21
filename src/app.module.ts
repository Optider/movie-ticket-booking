import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketModule } from './ticket/ticket.module';
import { DataSource } from 'typeorm';
import { Ticket } from './ticket/entities/ticket.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { APP_PIPE } from '@nestjs/core';

const configService = new ConfigService();

@Module({
  imports: [
    TicketModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configService.get<string>('DB_HOST') || 'localhost',
      port: configService.get<number>('DB_PORT') || 3306,
      username: configService.get<string>('DB_USERNAME') || 'root',
      password: configService.get<string>('DB_PASSWORD') || '',
      database: 'test',
      entities: [Ticket],
      synchronize: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      level: 'error',
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({ level: 'debug' }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [ConfigModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
