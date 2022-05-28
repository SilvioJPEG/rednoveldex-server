import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Journal } from 'src/journal/journal.model';
import { Novel } from 'src/novels/novels.model';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { NovelInListEntity } from './novel-in-a-list.model';
import { ListsController } from './lists.controller';
import { List } from './lists.model';
import { ListsService } from './lists.service';

@Module({
  controllers: [ListsController],
  providers: [ListsService, UsersService],
  exports: [ListsService],
  imports: [SequelizeModule.forFeature([List, Novel, User, Journal, NovelInListEntity]), AuthModule],
})
export class ListsModule {}
