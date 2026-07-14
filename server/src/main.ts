import 'reflect-metadata';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { db } from './db';
import { escrows } from './db/schema';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  try {
    logger.log('Running database migrations...');
    await migrate(db, { migrationsFolder: path.join(__dirname, '../drizzle') });
    logger.log('Database migrations completed successfully');

    await db.select().from(escrows).limit(1);
    logger.log('PostgreSQL connected & Escrows table verified');
  } catch (error) {
    logger.error('Database validation/migration failed:', error);
  }

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://byreixwift.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);
  logger.log(`Byreixwift server listening on http://localhost:${port}/api`);
}

bootstrap();
