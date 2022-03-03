import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('USERS')
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'user creation' })
  @ApiResponse({ status: 201, type: User })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'get user by username' })
  @ApiResponse({ status: 200, type: User })
  @Get(`/:username`)
  @HttpCode(HttpStatus.OK)
  getUserProfile(@Param('username') username: string) {
    return this.usersService.getUserProfile(username);
  }

}
