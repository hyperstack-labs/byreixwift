import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

const walletPattern = /^0x[a-fA-F0-9]{40}$/;

export class CreateEscrowDto {
  @IsString()
  @Matches(walletPattern, { message: 'buyer must be a valid wallet address' })
  buyer!: string;

  @IsString()
  @Matches(walletPattern, { message: 'seller must be a valid wallet address' })
  seller!: string;

  @IsNumber({ maxDecimalPlaces: 8 })
  @IsPositive()
  amount!: number;

  @IsString()
  tokenSymbol!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(0)
  @Max(1000000)
  fixedFee?: number;

  /**
   * The transaction hash of the on-chain creation log.
   * Required when registering live/on-chain escrows to verify parameters.
   */
  @IsOptional()
  @IsString()
  txHash?: string;
}

export class EscrowActionDto {
  @IsString()
  @Matches(walletPattern, { message: 'actor must be a valid wallet address' })
  actor!: string;

  /**
   * The transaction hash of the on-chain transition log.
   * Required for locking, releasing, or refunding live/on-chain escrows.
   */
  @IsOptional()
  @IsString()
  txHash?: string;
}
