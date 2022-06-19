import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AnalyticsDto {
  @IsNotEmpty()
  @IsString()
  method: string;

  @IsNotEmpty()
  @IsString()
  movieTitle: string;

  @IsNotEmpty()
  @IsDate()
  fromDate: Date;

  @IsNotEmpty()
  @IsDate()
  toDate: Date;

  @IsNotEmpty()
  @IsEnum({ Profit: 'Profit', Visit: 'Visit' })
  @ApiProperty({ enum: ['Profit', 'Visit'] })
  fetch: any;
}

export interface AnalyticsResponse {
  month: string;
  summaryProfit?: string;
  summaryVisits?: string;
}
