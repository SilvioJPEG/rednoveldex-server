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
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { CreateListDto } from './create-list.dto';
import { List } from './lists.model';
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
  create(
    @Body() body: { novels: number[]; description: string; name: string },
    @Req() req,
  ) {
    const user_id = req.user.sub;
    return this.listsService.createList({
      novels: body.novels,
      description: body.description,
      name: body.name,
      user_id,
    });
  }

  @ApiOperation({ summary: 'get lists by user' })
  @ApiResponse({ status: 200 })
  @Get('/:username/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getAllByUser(@Param('username') username: string) {
    const user = await this.usersService.getUserProfile(username);
    return this.listsService.getListsByUser(user.id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async deleteList(@Body() body: { list_id: number }) {
    return this.listsService.deleteList(body.list_id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateList(@Body() body: { updatedList: List }) {
    return this.listsService.updateList(body.updatedList);
  }
}
