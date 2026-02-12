// backend/src/modules/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('upload')
export class UploadController {

  // ✅ CORRECTION : Route d'upload qui sauvegarde dans uploads/chambres
  @Post('chambre')
  @UseInterceptors(FileInterceptor('file'))
  uploadChambreImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier envoyé');
    }

    // ✅ URL correcte pointant vers /api/uploads/chambres/
    const imageUrl = `http://localhost:3000/uploads/chambres/${file.filename}`;

    console.log(`✅ Image uploadée : ${file.filename}`);
    console.log(`📍 Chemin : uploads/chambres/${file.filename}`);

    return {
      success: true,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: imageUrl,
      message: 'Image uploadée avec succès',
    };
  }

  // ✅ Route générique (rétro-compatibilité)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier envoyé');
    }

    const imageUrl = `http://localhost:3000/uploads/chambres/${file.filename}`;

    return {
      success: true,
      filename: file.filename,
      url: imageUrl,
    };
  }
}