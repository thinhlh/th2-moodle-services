import { ClassSerializerInterceptor, INestApplication, INestMicroservice, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CustomExceptionFilter } from './config/filters/custom-exception.filter';
import { ResponseTransformInterceptor } from './config/interceptors/response.interceptor';
import { join } from 'path';
import { ResponseMapperInterceptor } from './config/interceptors/response-mapper.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await createApp()

  await appConfig(app);

  await app.listen(8080);
}

async function createApp(): Promise<NestExpressApplication> {
  return NestFactory.create<NestExpressApplication>(AppModule);
}

async function appConfig(app: NestExpressApplication) {
  app.enableShutdownHooks();
  app.setGlobalPrefix("/api");
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {

    }),
    new ResponseTransformInterceptor(),
    // new ErrorResponseInterceptor()
  );
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // Automatically transform to desired type,
    transformOptions: {
      enableImplicitConversion: true,
      // excludeExtraneousValues: true,
    }
  }))
  // app.useGlobalGuards(new AppGuard(new Reflector()));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"]
  })

  app.useStaticAssets(join(__dirname, '..', 'statics'), {
    fallthrough: true,
    prefix: "/statics",
  })

  app.enableCors()


  swaggerConfig(app);

}

async function swaggerConfig(app: INestApplication) {
  const swaggerOption = new DocumentBuilder()
    .setTitle("Mi Learning API")
    .setDescription("Mi Learning API documentation")
    .setVersion("1.0.0")
    .setContact("Hoang Thinh", "www.hoangthinh.me", "thinhlh0812@gmail.com")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOption);

  SwaggerModule.setup('/api/docs', app, document);
}
bootstrap();
