import { IsString, IsNumber } from 'class-validator';

export class updateEntityDto {
  @IsNumber()
  readonly started_reading?: number;

  @IsNumber()
  readonly finished_reading?: number;

  @IsNumber()
  readonly score?: number;

  @IsString({ message: 'Must be a string' })
  readonly status?: string;

  @IsString({ message: 'Must be a string' })
  readonly comments?: string;
}
