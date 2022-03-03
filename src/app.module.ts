import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { Novel } from './novels/novels.model';
import { NovelsModule } from './novels/novels.module';
import { List } from './lists/lists.model';
import { ListOfNovels } from './lists/list-of-novels.model';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/reviews.model';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/posts.model';
import { userFavourites } from './novels/user-favourites.model';
import { JournalModule } from './journal/journal.module';
import { Journal } from './journal/journal.model';
import { JournalOfNovels } from './journal/journal-of-novels.model';

@Module({
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Novel, userFavourites, List, ListOfNovels, Review, Post, Journal, JournalOfNovels],
      autoLoadModels: true, //чтобы sequelize создавал в бд таблицы на основании созданных моделей
    }),
    UsersModule,
    AuthModule,
    NovelsModule,
    ReviewsModule,
    PostsModule,
    JournalModule,
  ],
  controllers: [],
})
export class AppModule {}
