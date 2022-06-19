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
  @Transform((el) => el.value.toUpperCase())
  @IsEnum({ profit: 'profit', visit: 'visit' })
  fetch: any;
}
