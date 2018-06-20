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
import { Server, Keypair } from 'stellar-sdk';
const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
chai.should();
//const StellarChanLib = require("../src/index.js");

describe("getAccount", function() {
  it('error 404', function(done) {
      let stellarChan = new StellarChan(new Server("https://horizon-live.stellar.org:1337"));
      let keypair = Keypair.random();
      expect(() => {throw new Error()} ).to.throw();
      done();
  });

});
//https://horizon-testnet.stellar.org
//getAccount(keypair)
//createAccount(sourceKeypair, balance)
//trustAsset(trustKeypair, asset, limit)
//createAssetPayment(sourceKeypair, destination, asset, assetAmount, timeboundsMin, timeboundsMax)
//createChannel(sourceKeypair, destinationPublic, startingBalance, escrowAmount, asset, limit, timeboundsMin, timeboundsMax)
