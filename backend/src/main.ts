import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS pour permettre les requêtes du frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Port par défaut de Vite
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Préfixe global pour toutes les routes API
  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log(`🚀 Application backend démarrée sur: http://localhost:3000`);
  console.log(`📊 API disponible sur: http://localhost:3000/api`);
}
bootstrap();