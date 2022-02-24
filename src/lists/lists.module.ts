import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Novel } from 'src/novels/novels.model';
import { User } from 'src/users/users.model';
import { ListsController } from './lists.controller';
import { List } from './lists.model';
import { ListsService } from './lists.service';

@Module({
  controllers: [ListsController],
  providers: [ListsService],
  imports: [SequelizeModule.forFeature([List])],
  
})
export class ListsModule {}
