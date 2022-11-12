import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { AppLogger } from './logger/logger';

declare const module: any;

async function bootstrap() {
   const app = await NestFactory.create(AppModule,
      {
         logger: console,
         cors: true,
      });
   app.useGlobalPipes(new ValidationPipe({
      // Show error messages
      disableErrorMessages: false,
      // If user-service-provider-controller-dtos send extra data from the dto the data will be stripped
      whitelist: true,
      // To enable auto-transformation, set transform to true
      transform: true,
   }));
   app.use(json({ limit: '1mb' }));

   app.enableCors({
      credentials: true,
      origin: [''],
   });

   app.setGlobalPrefix('api');

   const options = new DocumentBuilder()
      .setTitle('Test App')
      .setDescription('Test App')
      .setVersion('1.0')
      .build();
   const document = SwaggerModule.createDocument(app, options);
   SwaggerModule.setup('api/swagger', app, document);
   // @ts-ignore
   app.use(helmet());
   // Allow this method on inside routes
   // app.use(csurf());
   app.useLogger(new AppLogger());
   await app.listen(process.env.PORT);
   if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
   }
}

bootstrap();
