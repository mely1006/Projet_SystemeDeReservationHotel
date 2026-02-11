// backend/src/modules/clients/dto/update-client.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsDate, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  @IsString()
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  prenom: string;

  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  nom: string;

  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  @IsEmail({}, { message: 'L\'email n\'est pas valide' })
  email: string;

  @IsNotEmpty({ message: 'Le téléphone est obligatoire' })
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

export enum ClientStatut {
  VIP = 'vip',
  REGULIER = 'regulier',
  NOUVEAU = 'nouveau',
}

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  prenom?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  nom?: string;

  @IsOptional()
  @IsEmail({}, { message: 'L\'email n\'est pas valide' })
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
  @IsEnum(ClientStatut)
  statut?: ClientStatut;

  @IsOptional()
  @IsNumber()
  nombreReservations?: number;

  @IsOptional()
  @IsNumber()
  depensesTotales?: number;

  @IsOptional()
  @IsDate()
  derniereVisite?: Date;
}