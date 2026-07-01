import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";

import { db } from "./db";
import { escrows } from "./db/schema";



async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  try {
    await db.select().from(escrows).limit(1); 
   
    console.log("PostgreSQL connected");
    console.log("Escrows table verified");
  } catch (error) {
    console.error("Database validation failed", error);
  }


  app.use(cookieParser());
  app.enableCors({
    origin: ["http://localhost:3000", "https://byreixwift.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);
  console.log(`Byreixwift server listening on http://localhost:${port}/api`);
}

bootstrap();
