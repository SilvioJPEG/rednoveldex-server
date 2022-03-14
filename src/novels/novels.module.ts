import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { JournalEntity } from 'src/journal/journal-entity.model';
import { Journal } from 'src/journal/journal.model';
import { List } from 'src/lists/lists.model';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { FavouritesService } from './favourites.service';
import { NovelsController } from './novels.controller';
import { Novel } from './novels.model';
import { NovelsService } from './novels.service';
import { userFavourites } from './user-favourites.model';

@Module({
  controllers: [NovelsController],
  providers: [NovelsService, FavouritesService],
  imports: [
    SequelizeModule.forFeature([
      Novel,
      List,
      User,
      userFavourites,
      Journal,
      JournalEntity,
    ]),
    UsersModule,
    AuthModule,
  ],
  exports: [FavouritesService, NovelsService]
})
export class NovelsModule {}
