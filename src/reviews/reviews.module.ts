import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { User } from 'src/users/users.model';
import { Novel } from 'src/novels/novels.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './reviews.model';

@Module({
  providers: [ReviewsService],
  controllers: [ReviewsController],
  imports: [SequelizeModule.forFeature([Review, User, Novel])],
})
export class ReviewsModule {}
