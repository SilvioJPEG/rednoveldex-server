import { IsString, Length, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateListDto {
  @IsString({ message: 'Must be a string' })
  @Length(4, 99, {
    message: 'password length should be between 4 and 99 characters',
  })
  @IsNotEmpty()
  readonly title: string;

  @IsNumber() 
  @IsNotEmpty()
  readonly userId: number;
}
