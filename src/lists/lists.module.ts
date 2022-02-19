import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';

@Module({
  providers: [ListsService]
})
export class ListsModule {}
