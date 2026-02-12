// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Créer les dossiers d'upload s'ils n'existent pas
  const uploadsDir = join(process.cwd(), 'uploads');
  const chambresDir = join(uploadsDir, 'chambres');

  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Dossier uploads/ créé');
  }
  if (!existsSync(chambresDir)) {
    mkdirSync(chambresDir, { recursive: true });
    console.log('📁 Dossier uploads/chambres/ créé');
  }

  // ✅ CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // ✅ Validation globale avec transform
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ✅ Préfixe global /api
  app.setGlobalPrefix('api');

  await app.listen(3000);

  console.log('🚀 Backend démarré sur : http://localhost:3000');
  console.log('📊 API disponible sur  : http://localhost:3000/api');
  console.log('🖼️  Images servies sur  : http://localhost:3000/uploads/chambres/');
  console.log('📁 Dossier uploads     : uploads/chambres/');
}
bootstrap();