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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AddNovelDto, novelVNDB } from './add-novel.dto';
import { FavouritesService } from './favourites.service';
import { Novel } from './novels.model';
import { NovelsService } from './novels.service';

@ApiTags('NOVELS')
@Controller('novels')
export class NovelsController {
  constructor(
    private novelsService: NovelsService,
    private favouritesService: FavouritesService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'add a new novel' })
  @ApiResponse({ status: 200, type: Novel })
  @Post('/add')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  create(@Body() novelDto: AddNovelDto) {
    return this.novelsService.create(novelDto);
  }

  @Post('/find/:title')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findInVNDB(@Param('title') title: string) {
    let item: novelVNDB = await this.novelsService.findInVNDB(title);
    return this.novelsService.create({
      title: item.title,
      original: item.original,
      image: item.image,
      releaseDate: item.released,
      description: item.description,
    });
  }

  @ApiOperation({ summary: 'get novel by id' })
  @ApiResponse({ status: 200, type: Novel })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: number) {
    return this.novelsService.getOne(id);
  }

  @ApiOperation({ summary: 'add to/delete from favourites with id=:id' })
  @ApiResponse({ status: 200, type: Novel })
  @Patch('/favourites/:id/update-favourites')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  updateFavourites(@Param('id') novelId: number, @Req() req) {
    return this.favouritesService.updateFavourites(novelId, req.user.sub);
  }

  @ApiOperation({
    summary: 'check if novel with specific id is in users favourites',
  })
  @ApiResponse({ status: 200 })
  @Get('/favourites/:id/check-favourites')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  checkIfFavourited(@Param('id') novelId: number, @Req() req) {
    return this.favouritesService.checkIfFavourited(novelId, req.user.sub);
  }

  @ApiOperation({
    summary: 'get list of favourites of specific user',
  })
  @ApiResponse({ status: 200 })
  @Get('favourites/:username/all')
  @HttpCode(HttpStatus.OK)
  async getFavouritesByUser(@Param('username') username: string) {
    const user = await this.usersService.getUserByName(username);
    return await this.favouritesService.getFavouritesByUser(user.id);
  }
  @ApiOperation({
    summary: 'get :amount of recently added novels',
  })
  @ApiResponse({ status: 200 })
  @Get('/recent/:amount')
  @HttpCode(HttpStatus.OK)
  async getRecentlyAdded(@Param('amount') amount: number) {
    return this.novelsService.getRecentlyAdded(amount);
  }

  @Get('/search/:data')
  async SearchFor(@Param('data') data: string) {
    const novels = await this.novelsService.searchFor(data);
    console.log(novels);
    return novels;
  }
}
