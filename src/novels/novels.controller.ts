import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AddNovelDto } from './add-novel.dto';
import { NovelsService } from './novels.service';

@ApiTags('NOVELS')
@Controller('novels')
export class NovelsController {
  constructor(
    private novelsService: NovelsService,
    private usersService: UsersService,
  ) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  create(@Body() novelDto: AddNovelDto) {
    return this.novelsService.create(novelDto);
  }

  //get novel info by id
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.novelsService.getOne(id);
  }

  @Patch('/:id/favourited')
  @UseGuards(JwtAuthGuard)
  addToFavourites(@Param('id') novelId: number, @Body() userId: number) {
    return this.novelsService.AddToFavourites(novelId, userId);
  }

  @Patch('/:id/unfavourited')
  @UseGuards(JwtAuthGuard)
  deleteFromFavourites(@Param('id') novelId: number, @Body() userId: number) {
    return this.novelsService.DeleteFromFavourites(novelId, userId);
  }

  @Get('/:username/favAll')
  async getFavouritesByUser(@Param('username') username: string) {
    const user = await this.usersService.getUserByName(username);
    return this.novelsService.GetFavouritesByUser(user.id);
  }

  @Get('/recent/:amount')
  async getRecentlyAdded(@Param('amount') amount: number) {
    return this.novelsService.getRecentlyAdded(amount);
  }
}
