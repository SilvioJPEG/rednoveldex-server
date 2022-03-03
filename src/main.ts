import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport-jwt'

async function start() {
  const PORT = parseInt(process.env.SERVER_PORT) || 5000;
  const app = await NestFactory.create(AppModule);
  const options = {
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    origin: true,
    credentials: true,
  };

  app.use(session({
    secret: process.env.SECRET_KEY,
    
  }))
  app.enableCors(options);

  const config = new DocumentBuilder()
    .setTitle('Документация REST API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Server started on port = ${PORT}`);
  });
}
start();
