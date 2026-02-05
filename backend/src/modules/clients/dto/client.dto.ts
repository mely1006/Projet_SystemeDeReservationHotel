import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  prenom: string;

  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  telephone: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsString()
  codePostal?: string;

  @IsOptional()
  @IsString()
  pays?: string;
}

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsString()
  codePostal?: string;

  @IsOptional()
  @IsString()
  pays?: string;

  @IsOptional()
  @IsEnum(['nouveau', 'regulier', 'vip'])
  statut?: string;

    nombreReservations?: number;

    depensesTotales?: number    
}