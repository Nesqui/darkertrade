import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TimeoutInterceptor } from './interceptors';
const version = '0.0.1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger('backend'),
  });
  const cfg = app.get(ConfigService);
  app.enableCors();
  app.enableShutdownHooks();
  // app.setGlobalPrefix('api')
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  app.use(bodyParser.json({ limit: '50mb' }));

  const port = cfg.get<number>('APP_PORT') ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('Accounting documentation')
    .setDescription('The Accounting API description')
    .setVersion(cfg.get('APP_VERSION', version))
    .addSecurityRequirements('bearer')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(cfg.get('SWAGGER_PATH', '/docs'), app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      displayOperationId: true,
      displayRequestDuration: true,
    },
  });
  await app.listen(port);
  return port;
}
bootstrap().then((port: number) => {
  Logger.log(`Application running on port: ${port}`, 'Main');
});
