import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UsersService } from 'src/users/users.service';
import { ReviewsController } from './reviews.controller';
import { User } from 'src/users/users.model';
import { Novel } from 'src/novels/novels.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './reviews.model';
import { AuthModule } from 'src/auth/auth.module';
import { Journal } from 'src/journal/journal.model';

@Module({
  providers: [ReviewsService, UsersService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
  imports: [
    SequelizeModule.forFeature([Review, User, Novel, Journal]), 
    AuthModule
  ],
})
export class ReviewsModule {}
