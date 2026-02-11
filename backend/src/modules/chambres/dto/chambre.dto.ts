import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateChambreDto {
  @IsNotEmpty()
  @IsString()
  numero: string;

  @IsNotEmpty()
  @IsEnum(['standard', 'double', 'deluxe', 'suite', 'suite_presidentielle'])
  type: string;

  @IsNotEmpty()
  @IsNumber()
  prix: number;

  @IsNotEmpty()
  @IsNumber()
  capacite: number;

  @IsNotEmpty()
  @IsNumber()
  etage: number;

  @IsNotEmpty()
  @IsNumber()
  superficie: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  equipements?: string[];
}

export class UpdateChambreDto {
  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsEnum(['standard', 'double', 'deluxe', 'suite', 'suite_presidentielle'])
  type?: string;

  @IsOptional()
  @IsNumber()
  prix?: number;

  @IsOptional()
  @IsNumber()
  capacite?: number;

  @IsOptional()
  @IsNumber()
  etage?: number;

  @IsOptional()
  @IsNumber()
  superficie?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['disponible', 'occupee', 'maintenance'])
  statut?: string;

  @IsOptional()
  @IsArray()
  equipements?: string[];
}