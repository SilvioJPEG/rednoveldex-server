import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { ListsService } from './lists.service';
interface AuthRequest extends Request {
  user: User;
}
@ApiTags('LISTS')
@Controller('lists')
export class ListsController {
  constructor(
    private listsService: ListsService,
    private usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() title: string, @Req() req: AuthRequest) {
    const userId = req.user.id;
    return this.listsService.createList({ title, userId });
  }

  @Get('/:username/')
  async getAllByUser(@Param('username') username: string) {
    const user = await this.usersService.getUserByName(username);
    return this.listsService.getListByUser(user.id);
  }
}
