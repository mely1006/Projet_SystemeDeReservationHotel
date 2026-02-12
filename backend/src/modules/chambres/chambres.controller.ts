// backend/src/modules/chambres/chambres.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ChambresService } from './chambres.service';
import { CreateChambreDto, UpdateChambreDto } from './dto/chambre.dto';

@Controller('chambres')
export class ChambresController {
  constructor(private readonly chambresService: ChambresService) {}

  // Créer une chambre
  @Post()
  create(@Body() createChambreDto: CreateChambreDto) {
    return this.chambresService.create(createChambreDto);
  }

  //  Créer une chambre AVEC image en une seule requête (multipart/form-data)
  @Post('avec-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'chambres'),
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const isValid =
          allowedTypes.test(extname(file.originalname).toLowerCase()) &&
          allowedTypes.test(file.mimetype);

        if (isValid) {
          cb(null, true);
        } else {
          cb(new Error('Seules les images sont autorisées'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createAvecImage(
    @Body() createChambreDto: CreateChambreDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Si une image est fournie, ajouter l'URL
    if (file) {
      createChambreDto.imageUrl = `http://localhost:3000/uploads/chambres/${file.filename}`;
    }

    return this.chambresService.create(createChambreDto);
  }

  // Upload image pour une chambre existante
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'chambres'),
        filename: (req, file, cb) => {
          const chambreId = req.params.id;
          const unique = Date.now() + '-' + chambreId;
          cb(null, unique + extname(file.originalname));
        },
      }),
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
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier envoyé');
    }

    const imageUrl = `http://localhost:3000/uploads/chambres/${file.filename}`;

    // Mettre à jour la chambre avec l'URL de l'image
    const chambre = await this.chambresService.update(id, { imageUrl });

    return {
      success: true,
      filename: file.filename,
      url: imageUrl,
      chambre,
    };
  }

  @Get()
  findAll(
    @Query('statut') statut?: string,
    @Query('type') type?: string,
    @Query('etage') etage?: string,
  ) {
    return this.chambresService.findAll(
      statut,
      type,
      etage ? parseInt(etage) : undefined,
    );
  }

  @Get('stats')
  getStats() {
    return this.chambresService.getStats();
  }

  @Get('disponibles')
  findDisponibles(
    @Query('dateDebut') dateDebut: string,
    @Query('dateFin') dateFin: string,
  ) {
    return this.chambresService.findDisponibles(
      new Date(dateDebut),
      new Date(dateFin),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chambresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChambreDto: UpdateChambreDto,
  ) {
    return this.chambresService.update(id, updateChambreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chambresService.remove(id);
  }
}