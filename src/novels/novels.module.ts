import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { List } from 'src/lists/lists.model';
import { userFavourites } from 'src/users/user-favourites.model';
import { User } from 'src/users/users.model';
import { NovelsController } from './novels.controller';
import { Novel } from './novels.model';
import { NovelsService } from './novels.service';

@Module({
  controllers: [NovelsController],
  providers: [NovelsService],
  imports: [SequelizeModule.forFeature([Novel, List, userFavourites])],
})
export class NovelsModule {}
