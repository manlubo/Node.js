import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from "passport";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    session({
      // 세션 암호화에 사용하는 키
      secret: 'very-important-secret',
      // 세션을 항상 저장할 지 여부
      resave: false,
      // 세션이 저장되기 전 초기화 하지 않은 상태로 세션을 미리 만들어 저장
      saveUninitialized: false,
      // 쿠키 유효시간 1시간
      cookie: {maxAge: 3600000}
    }),
  )
  // passport 초기화 및 세션 저장소 초기화
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
