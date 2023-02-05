import { ClassSerializerInterceptor, INestApplication, INestMicroservice, ValidationPipe, VersioningType } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CustomExceptionFilter } from './config/filters/custom-exception.filter';
import { ResponseTransformInterceptor } from './config/interceptors/response.interceptor';
import { join } from 'path';
import { ResponseMapperInterceptor } from './config/interceptors/response-mapper.interceptor';
import { async } from 'rxjs';
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';

async function bootstrap() {
  const app = await createApp()

  await appConfig(app);

  await app.listen();
}

async function createApp(): Promise<INestMicroservice> {
  return NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    options: {
      urls: [`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
      queue: 'schedule_queue',
      queueOptions: {
        durable: false
      },
    },
    transport: Transport.RMQ
  });
}

async function appConfig(app: INestMicroservice) {
  app.enableShutdownHooks();
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


}

bootstrap();