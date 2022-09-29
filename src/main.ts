import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import { ValidationPipe } from '@nestjs/common';
import { QueryErrorFilter } from './shared/filters/query-error.filter';
import { AllErrorFilter } from './shared/filters/all-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new QueryErrorFilter(httpAdapter),
    new AllErrorFilter(httpAdapter),
  );

  const config = new DocumentBuilder()
    .setTitle('Gembrs API Docs')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const theme = new SwaggerTheme('v3');
  const options = {
    explorer: true,
    customCss: theme.getBuffer('flattop'),
  };
  const document = SwaggerModule.createDocument(app, config);
  /*fs.writeFileSync(
    join(__dirname, '..', 'api-docs', 'gembrs.json'),
    JSON.stringify(document),
  );*/
  SwaggerModule.setup('docs', app, document, options);
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
