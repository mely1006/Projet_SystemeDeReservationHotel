import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';


export const CONTRAINTES_CHAMBRE = {
  standard: {
    prix: { min: 10000, max: 50000 },
    superficie: { min: 15, max: 30 },
    capacite: { min: 1, max: 2 },
  },
  double: {
    prix: { min: 30000, max: 80000 },
    superficie: { min: 20, max: 40 },
    capacite: { min: 1, max: 3 },
  },
  deluxe: {
    prix: { min: 50000, max: 150000 },
    superficie: { min: 25, max: 55 },
    capacite: { min: 1, max: 4 },
  },
  suite: {
    prix: { min: 80000, max: 300000 },
    superficie: { min: 35, max: 80 },
    capacite: { min: 1, max: 6 },
  },
  suite_presidentielle: {
    prix: { min: 150000, max: 1000000 },
    superficie: { min: 60, max: 200 },
    capacite: { min: 1, max: 10 },
  },
};

// ============================================================
// CREATE DTO
// ============================================================

export class CreateChambreDto {
  @IsNotEmpty({ message: 'Le numéro de chambre est obligatoire' })
  @IsString()
  numero: string;

  @IsNotEmpty({ message: 'Le type est obligatoire' })
  @IsEnum(
    ['standard', 'double', 'deluxe', 'suite', 'suite_presidentielle'],
    { message: 'Type invalide. Valeurs acceptées : standard, double, deluxe, suite, suite_presidentielle' }
  )
  type: string;

  @IsNotEmpty({ message: 'Le prix est obligatoire' })
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Type(() => Number)
  @Min(5000, { message: 'Le prix minimum est de 5 000 FCFA' })
  @Max(2000000, { message: 'Le prix maximum est de 2 000 000 FCFA' })
  prix: number;

  @IsNotEmpty({ message: 'La capacité est obligatoire' })
  @IsInt({ message: 'La capacité doit être un entier' })
  @Type(() => Number)
  @Min(1, { message: 'La capacité minimum est de 1 personne' })
  @Max(20, { message: 'La capacité maximum est de 20 personnes' })
  capacite: number;

  @IsNotEmpty({ message: 'L\'étage est obligatoire' })
  @IsInt({ message: 'L\'étage doit être un entier' })
  @Type(() => Number)
  @Min(0, { message: 'L\'étage minimum est le rez-de-chaussée (0)' })
  @Max(100, { message: 'L\'étage maximum est 100' })
  etage: number;

  @IsNotEmpty({ message: 'La superficie est obligatoire' })
  @IsNumber({}, { message: 'La superficie doit être un nombre' })
  @Type(() => Number)
  @Min(10, { message: 'La superficie minimum est de 10 m²' })
  @Max(500, { message: 'La superficie maximum est de 500 m²' })
  superficie: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  equipements?: string[];

 
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  statut: string;
}


export class UpdateChambreDto {
  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsEnum(
    ['standard', 'double', 'deluxe', 'suite', 'suite_presidentielle'],
    { message: 'Type invalide' }
  )
  type?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Type(() => Number)
  @Min(5000, { message: 'Le prix minimum est de 5 000 FCFA' })
  @Max(2000000, { message: 'Le prix maximum est de 2 000 000 FCFA' })
  prix?: number;

  @IsOptional()
  @IsInt({ message: 'La capacité doit être un entier' })
  @Type(() => Number)
  @Min(1, { message: 'La capacité minimum est de 1 personne' })
  @Max(20, { message: 'La capacité maximum est de 20 personnes' })
  capacite?: number;

  @IsOptional()
  @IsInt({ message: 'L\'étage doit être un entier' })
  @Type(() => Number)
  @Min(0, { message: 'L\'étage minimum est 0 (rez-de-chaussée)' })
  @Max(100, { message: 'L\'étage maximum est 100' })
  etage?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La superficie doit être un nombre' })
  @Type(() => Number)
  @Min(10, { message: 'La superficie minimum est de 10 m²' })
  @Max(500, { message: 'La superficie maximum est de 500 m²' })
  superficie?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(
    ['disponible', 'occupee', 'maintenance'],
    { message: 'Statut invalide. Valeurs : disponible, occupee, maintenance' }
  )
  statut?: string;

  @IsOptional()
  @IsArray()
  equipements?: string[];

  
  @IsOptional()
  @IsString()
  imageUrl?: string;
}