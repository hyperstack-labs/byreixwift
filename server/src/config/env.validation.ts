import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsNumber()
  @IsOptional()
  PORT?: number;

  @IsString()
  @IsOptional()
  RPC_URL?: string;

  @IsString()
  @IsOptional()
  CONTRACT_ADDRESS?: string;

  @IsString()
  @IsOptional()
  KYCPORT_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  KYCPORT_CLIENT_SECRET?: string;

  @IsString()
  @IsOptional()
  KYCPORT_REDIRECT_URI?: string;

  @IsString()
  @IsOptional()
  KYCPORT_WEBHOOK_SECRET?: string;

  @IsString()
  @IsOptional()
  KYCPORT_ISSUER?: string;

  @IsString()
  @IsOptional()
  FRONTEND_URL?: string;
}

/**
 * Validates the loaded environment configuration on startup.
 * Throws an error immediately if any required key is missing or invalid.
 */
export function validate(config: Record<string, any>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `❌ Startup validation failed for environment configuration:\n${errors.toString()}`,
    );
  }
  return validatedConfig;
}
