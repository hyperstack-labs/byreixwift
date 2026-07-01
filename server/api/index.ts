import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { Express } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

let cachedServer: Express;

async function bootstrapServer(): Promise<Express> {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new (require("@nestjs/platform-express").ExpressAdapter)(expressApp)
    );

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

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async (req: any, res: any) => {
  const server = await bootstrapServer();
  return server(req, res);
};
