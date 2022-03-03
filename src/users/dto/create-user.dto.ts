import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'CoolAidMan13', description: 'username' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty()
  readonly username: string;
  
  @ApiProperty({ example: 'qwerty13', description: 'password' })
  @IsString({ message: 'Must be a string' })
  @Length(6, 16, {
    message: 'password length should be between 4 and 16 characters',
  })
  @IsNotEmpty()
  readonly password: string;
}
