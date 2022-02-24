import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { Role } from './roles/roles.model';
import { UsersController } from './users/users.controller';
import * as dotenv from 'dotenv';
import { Novel } from './novels/novels.model';
import { NovelsModule } from './novels/novels.module';
import { userFavourites } from './users/user-favourites.model';
import { List } from './lists/lists.model';
import { ListsModule } from './lists/lists.module';

@Module({
  controllers: [],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres', 
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: 'postgres', 
      password: 'postpass',
      database: process.env.POSTGRES_DB,
      models: [User, Novel, userFavourites],
      autoLoadModels: true, //чтобы sequelize создавал в бд таблицы на основании созданных моделей
    }),
    UsersModule,
    AuthModule,
    NovelsModule
  ],
})
export class AppModule {}
