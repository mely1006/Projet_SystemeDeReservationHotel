import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaiementDto {
  @IsNotEmpty()
  @IsNumber()
  montant: number;

  @IsNotEmpty()
  @IsEnum(['carte_bancaire', 'especes', 'virement', 'paypal'])
  methode: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsNumber()
  reservationId: number;
}

export class UpdatePaiementDto {
  @IsOptional()
  @IsNumber()
  montant?: number;

  @IsOptional()
  @IsEnum(['carte_bancaire', 'especes', 'virement', 'paypal'])
  methode?: string;

  @IsOptional()
  @IsEnum(['en_attente', 'valide', 'rembourse', 'echoue'])
  statut?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}