import * as StellarSDK from 'stellar-sdk'

export = StellarChan

export class StellarChan {
  server: StellarSDK.Server;
  
  constructor(server: StellarSDK.Server);
  getAccount(keypair: StellarSDK.Keypair): Promise<StellarSDK.AccountResponse>;
  createAccount(sourceKeypair: StellarSDK.Keypair, balance: string): Promise<CreateAccountResponse>;
  trustAsset(trustKeypair: StellarSDK.Keypair, asset: StellarSDK.Asset, limit: string): Promise<any>;
  createAssetPayment(
    sourceKeypair: StellarSDK.Keypair,
    destination: string,
    asset: StellarSDK.Asset,
    assetAmount: string,
    timeboundsMin: number | string,
    timeboundsMax: number | string,
  ): Promise<any>
  createChannel(
    sourceKeypair: StellarSDK.Keypair,
    destinationPublic: string,
    startingBalnce: string,
    escrowAmount: string,
    asset: StellarSDK.Asset,
    limit: string
  ): Promise<CreateChannelResponse>
}

export type CreateAccountResponse = {
  err: Error | null;
  keypair: StellarSDK.Keypair;
  result: any;
}

export type CreateChannelResponse = {
  escrowKeypair: StellarSDK.Keypair;
  destinationPublic: string;
  asset: StellarSDK.Asset;
  limit: string;
  startingBalance: string;
  unlockXDR: Buffer;
  recoveryXDR: Buffer;
  paymentResult: any;
}