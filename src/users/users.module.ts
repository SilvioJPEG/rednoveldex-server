import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Journal } from 'src/journal/journal.model';
import { JournalService } from 'src/journal/journal.service';
import { List } from 'src/lists/lists.model';
import { Novel } from 'src/novels/novels.model';
import { Review } from 'src/reviews/reviews.model';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, Novel, List, Review, Journal])],
  exports: [UsersService]
})
export class UsersModule {}
