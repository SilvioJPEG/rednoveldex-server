import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Novel } from 'src/novels/novels.model';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { JournalOfNovels } from './journal-of-novels.model';
import { JournalController } from './journal.controller';
import { Journal } from './journal.model';
import { JournalService } from './journal.service';

@Module({
  controllers: [JournalController],
  providers: [JournalService, UsersService],
  imports: [SequelizeModule.forFeature([Journal, JournalOfNovels, Novel, User]), AuthModule],
})
export class JournalModule {}
