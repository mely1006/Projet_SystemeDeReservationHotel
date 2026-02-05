import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  dateDebut: string;

  @IsNotEmpty()
  @IsDateString()
  dateFin: string;

  @IsOptional()
  @IsString()
  heureArrivee?: string;

  @IsOptional()
  @IsString()
  heureDepart?: string;

  @IsNotEmpty()
  @IsNumber()
  nombreAdultes: number;

  @IsOptional()
  @IsNumber()
  nombreEnfants?: number;

  @IsOptional()
  @IsString()
  demandesSpeciales?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @IsNotEmpty()
  @IsNumber()
  chambreId: number;

  @IsNotEmpty()
  @IsNumber()
  prixTotal: number;
}

export class UpdateReservationDto {
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @IsOptional()
  @IsString()
  heureArrivee?: string;

  @IsOptional()
  @IsString()
  heureDepart?: string;

  @IsOptional()
  @IsNumber()
  nombreAdultes?: number;

  @IsOptional()
  @IsNumber()
  nombreEnfants?: number;

  @IsOptional()
  @IsEnum(['en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee'])
  statut?: string;

  @IsOptional()
  @IsNumber()
  prixTotal?: number;

  @IsOptional()
  @IsString()
  demandesSpeciales?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  chambreId?: number;
}