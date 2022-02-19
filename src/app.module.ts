import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { NovelsModule } from './novels/novels.module';
import { AuthModule } from './auth/auth.module';
import { Role } from './roles/roles.model';
import { userFavourites } from './users/user-favourites.model';
import { ListsController } from './lists/lists.controller';
import { ListsModule } from './lists/lists.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'env' }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, userFavourites],
      autoLoadModels: true, //чтобы sequelize создавал в бд таблицы на основании созданных моделей
    }),
    UsersModule,
    RolesModule,
    NovelsModule,
    AuthModule,
    ListsModule,
  ],
  controllers: [AppController, ListsController],
  providers: [AppService],
})
export class AppModule {}
