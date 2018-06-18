import * as StellarSDK from 'stellar-sdk';

class StellarChan {
  constructor(server) {
    this.server = server;
  }
  async getAccount(keypair) {
    return this.server.loadAccount(keypair.publicKey());
  }

  async createAccount(sourceKeypair, balance) {
    try {
      let sourceAccount = await this.getAccount(sourceKeypair);
      const newKeypair = StellarSDK.Keypair.random();
      let tx = new StellarSDK.TransactionBuilder(sourceAccount)
        .addOperation(StellarSDK.Operation.createAccount({
          destination: newKeypair.publicKey(),
          startingBalance: balance,
        }))
        .build();
      tx.sign(sourceKeypair);
      const result = await this.server.submitTransaction(tx);
      return {
        err: null,
        result,
        keypair: newKeypair,
      };
    } catch (err) {
      throw (err);
    }
  }

  async trustAsset(trustKeypair, asset, limit) {
    try {
      // Get Account
      let trustAccount = await this.getAccount(trustKeypair);
      let tx = new StellarSDK.TransactionBuilder(trustAccount)
        .addOperation(StellarSDK.Operation.changeTrust({
          asset,
          limit: limit || null,
        }))
        .build();
      tx.sign(trustKeypair);
      return await this.server.submitTransaction(tx);
    } catch (err) {
      throw (err);
    }
  }
  async createAssetPayment(sourceKeypair, destination, asset, assetAmount, timeboundsMin, timeboundsMax) {
    try {
      let sourceAccount = await this.getAccount(sourceKeypair);
      let opts;
      opts.timebounds.minTime = timeboundsMin;
      opts.timebounds.maxTime = timeboundsMax;
      let tx = new StellarSDK.TransactionBuilder(sourceAccount, opts)
        .addOperation(StellarSDK.Operation.payment({
          destination,
          asset,
          amount: assetAmount,
        }))
        .build();
      tx.sign(sourceKeypair);
      return await this.server.submitTransaction(tx);
    } catch (err) {
      throw (err);
    }
  }

  async createChannel(sourceKeypair, destinationPublic, startingBalance, escrowAmount, asset, limit, timeboundsMin, timeboundsMax) {
    try {
      // create escrow account
      const escrow = await this.createAccount(sourceKeypair, startingBalance);
      if (!escrow.err) throw (escrow.err);

      // Trust asset if not native
      if (asset) {
        // Trust asset
        const trustResult = await this.trustAsset(escrow.keypair, asset, limit);
      } else {
        // TODO
      }

      // lock
      let multisigTx = new StellarSDK.TransactionBuilder(await this.getAccount(escrow.keypair))
        .addOperation(StellarSDK.Operation.setOptions({
          signer: {
            ed25519PublicKey: destinationPublic,
            weight: 1,
          },
          lowThreshold: 2,
          medThreshold: 2,
          highThreshold: 2,
        }))
        .build();
      multisigTx.sign(escrow.keypair);
      const multisigResult = await this.server.submitTransaction(multisigTx);

      // create unlock
      let unlockTx = new StellarSDK.TransactionBuilder(await this.getAccount(escrow.keypair))
        .addOperation(StellarSDK.Operation.setOptions({
          masterWeight: 0,
          lowThreshold: 1,
          medThreshold: 1,
          highThreshold: 1,
        }))
        .build();
      unlockTx.sign();
      const unlockXDR = unlockTx.toEnvelope().toXDR('base64');

      // create recovery
      let recoveryTx = new StellarSDK.TransactionBuilder(await this.getAccount(escrow.keypair))
        .addOperation(StellarSDK.Operation.setOptions({
          signer: {
            ed25519PublicKey: destinationPublic,
            weight: 0,
          },
          lowThreshold: 1,
          medThreshold: 1,
          highThreshold: 1,
        }))
        .build();
      const recoveryXDR = recoveryTx.toEnvelope().toXDR('base64');

      // Payment asset to escrow
      const paymentResult = await this.createAssetPayment(sourceKeypair, destinationPublic, asset, escrowAmount, timeboundsMin, timeboundsMax);

      return {
        escrowKeypair: escrow.keypair,
        destinationPublic,
        asset,
        limit,
        startingBalance,
        unlockXDR,
        recoveryXDR,
        paymentResult,
      };
    } catch (err) {
      throw (err);
    }
  }
}

export default StellarChan;
