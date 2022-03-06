import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
  @ApiOperation({ summary: 'get profile data by user with valid access token' })
  @ApiResponse({ status: 200, type: User })
  @Get(`retrive/:username`)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  LoggedInRetriving(@Param('username') username: string) {
    return this.usersService.getUserProfile(username);
  }

  @ApiOperation({ summary: 'change user data' })
  @ApiResponse({ status: 200, type: User })
  @Patch('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  updateUserData(@Req() req, @Body() body) {
    return this.usersService.updateUserData(req.user.sub, body);
  }

  @ApiOperation({ summary: 'delete user completely' })
  @ApiResponse({ status: 200 })
  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteUserData(@Req() req) {
    return this.usersService.deleteUser(req.user.sub);
  }
}
