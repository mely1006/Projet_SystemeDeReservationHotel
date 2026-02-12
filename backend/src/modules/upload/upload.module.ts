// backend/src/modules/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        // ✅ CORRECTION : destination dans backend/uploads/chambres
        destination: join(process.cwd(), 'uploads', 'chambres'),
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      // ✅ Filtrer uniquement les images
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const isValid =
          allowedTypes.test(extname(file.originalname).toLowerCase()) &&
          allowedTypes.test(file.mimetype);

        if (isValid) {
          cb(null, true);
        } else {
          cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'), false);
        }
      },
      // ✅ Limiter la taille à 5MB
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}