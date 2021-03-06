import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JournalService } from './journal/journal.service';
import { ListsService } from './lists/lists.service';
import { FavouritesService } from './novels/favourites.service';
import { Novel } from './novels/novels.model';
import { NovelsService } from './novels/novels.service';
import { Express } from 'express';
import { Review } from './reviews/reviews.model';
import { ReviewsService } from './reviews/reviews.service';
import { User } from './users/users.model';
import { UsersService } from './users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
//контроллер должен оставаться тонким, всю логику стоит выносить в service
@Controller('/api')
export class AppController {
  constructor(
    private favouritesService: FavouritesService,
    private usersService: UsersService,
    private reviewsService: ReviewsService,
    private listsService: ListsService,
    private journalService: JournalService,
    private novelsService: NovelsService,
  ) {}

  @ApiOperation({ summary: 'get home page data' })
  @ApiResponse({ status: 200 })
  @Get('home')
  async getHomePageData(): Promise<{ reviews: Review[]; novels: Novel[] }> {
    const reviews = await this.reviewsService.getLatestReviewOverall();
    const novels = await this.novelsService.getRecentlyAdded(4);
    return { reviews, novels };
  }

  @ApiOperation({ summary: 'get profile page data' })
  @ApiResponse({ status: 200 })
  @Get('profile/:username')
  @HttpCode(HttpStatus.OK)
  async getProfileData(@Param('username') username: string): Promise<{
    User: User;
    journalLength: number;
    listsAmount: number;
    favourites: Novel[];
    reviews: Review[];
  }> {
    const userData = await this.usersService.getUserFull(username);
    const { journalLength } = await this.journalService.getJournalLength(
      userData.id,
    );
    const { listsAmount } = await this.listsService.getAmountByUser(
      userData.id,
    );
    const reviews = await this.reviewsService.getReviewsByUser(
      userData.username,
    );
    const favourites = await this.favouritesService.getFavouritesByUser(
      userData.id,
    );
    const User = await this.usersService.getUserProfile(username);
    return { User, journalLength, listsAmount, reviews, favourites };
  }

  @Post('/user/settings')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploadedFiles/avatars',
      }),
    }),
  )
  async setProfileData(@UploadedFile() file: Express.Multer.File) {}
}
