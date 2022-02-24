import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { userFavourites } from 'src/users/user-favourites.model';
import { User } from 'src/users/users.model';
import { NovelsController } from './novels.controller';
import { Novel } from './novels.model';
import { NovelsService } from './novels.service';

@Module({
  controllers: [NovelsController],
  providers: [NovelsService],
  imports: [SequelizeModule.forFeature([Novel, userFavourites])],
})
export class NovelsModule {}
