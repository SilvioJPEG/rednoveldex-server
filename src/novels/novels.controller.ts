import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AddNovelDto } from './add-novel.dto';
import { FavouritesService } from './favourites.service';
import { NovelsService } from './novels.service';

@ApiTags('NOVELS')
@Controller('novels')
export class NovelsController {
  constructor(
    private novelsService: NovelsService,
    private favouritesService: FavouritesService,
    private usersService: UsersService,
  ) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  create(@Body() novelDto: AddNovelDto) {
    return this.novelsService.create(novelDto);
  }

  //get novel info by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: number) {
    return this.novelsService.getOne(id);
  }

  @Patch('/favourites/:id/update-favourites')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  updateFavourites(@Param('id') novelId: number, @Req() req) {
    return this.favouritesService.updateFavourites(novelId, req.user.sub);
  }
  @Get('/favourites/:id/check-favourites')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  checkIfFavourited(@Param('id') novelId: number, @Req() req) {
    return this.favouritesService.checkIfFavourited(novelId, req.user.sub);
  }
  @Get('favourites/:username/all')
  @HttpCode(HttpStatus.OK)
  async getFavouritesByUser(@Param('username') username: string) {
    const user = await this.usersService.getUserByName(username);
    return await this.favouritesService.getFavouritesByUser(user.id);
  }

  @Get('/recent/:amount')
  @HttpCode(HttpStatus.OK)
  async getRecentlyAdded(@Param('amount') amount: number) {
    return this.novelsService.getRecentlyAdded(amount);
  }
}
