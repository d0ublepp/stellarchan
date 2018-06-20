// import { assert } from 'chai';
// import defaultAwesomeFunction, { awesomeFunction } from '../src';

// describe('Awesome test.', () => {
//   it('should test default awesome function', () => {
//     const expectedVal = 'I am the Default Awesome Function, fellow comrade! - Dinesh'
//     assert(defaultAwesomeFunction('Dinesh') === expectedVal, 'Default not awesome :(');
//   });

//   it('should test awesome function', () => {
//     const expectedVal = 'I am just an Awesome Function'
//     assert(awesomeFunction() === expectedVal, 'Named awesome :(');
//   });
// });
import StellarChan from '../src/index.js';
import * as StellarSDK from 'stellar-sdk';
const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
chai.use(require('chai-as-promised'))
chai.should();
//const StellarChanLib = require("../src/index.js");
describe("getAccount", function() {
  it('error 404', function(done) {
      let stellarChan = new StellarChan(new StellarSDK.Server("https://horizon-testnet.stellar.org"));
      let keypair = StellarSDK.Keypair.random();
      expect(stellarChan.getAccount(keypair)).to.be.rejectedWith(/404/).notify(done)
  });
});
//https://horizon-testnet.stellar.org
//getAccount(keypair)
//createAccount(sourceKeypair, balance)
//trustAsset(trustKeypair, asset, limit)
//createAssetPayment(sourceKeypair, destination, asset, assetAmount, timeboundsMin, timeboundsMax)
//createChannel(sourceKeypair, destinationPublic, startingBalance, escrowAmount, asset, limit, timeboundsMin, timeboundsMax)
