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
const axios = require('axios')

const mockLoadAccountResponse = require('./load-account-response.json')

chai.use(require('chai-as-promised'))
chai.should();
//const StellarChanLib = require("../src/index.js");

const onlyNonFunctions = (obj) => {
  const r = {}
  Object.keys(obj).forEach(key => {
    if(typeof obj[key] === 'object') {
      r[key] = onlyNonFunctions(obj[key])
    } else if (typeof obj[key] !== 'function') {
      r[key] = obj[key]
    }
  })
}

describe("StellarChan", function() {
  beforeEach(function(done) {
    this.axiosMock = sinon.mock(axios)
    done();
  });

  afterEach(function(done) {
    this.axiosMock.verify();
    this.axiosMock.restore();
    done();
  });

  describe("getAccount", function() {
    it('returns correct account object!', async function() {
      this.axiosMock
        .expects('get')
        .atLeast(1)
        .withArgs(sinon.match('https://horizon-live.stellar.org:1337/accounts/GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS'))
        .returns(Promise.resolve({ data: mockLoadAccountResponse }))
      
      const mockKeypair = {
        publicKey: () => 'GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS'
      }

      const expected = await new StellarSDK.Server("https://horizon-live.stellar.org:1337").loadAccount('GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS')
      // console.log(expected)
      let stellarChan = new StellarChan(new StellarSDK.Server("https://horizon-live.stellar.org:1337"));
      let setllarAccount = await stellarChan.getAccount(mockKeypair)
      // expect(stellarChan.getAccount(mockKeypair).then(res => Promise.resolve(onlyNonFunctions(res))) ).to.eventually.equal(onlyNonFunctions(expected)).notify(done)
      expect(onlyNonFunctions(setllarAccount)).to.deep.equal(onlyNonFunctions(expected))
    });

    // it('error 404', function(done) {
    //     let stellarChan = new StellarChan(new StellarSDK.Server("https://horizon-live.stellar.org:1337"));
    //     let keypair = StellarSDK.Keypair.random();
    //     expect(stellarChan.getAccount(keypair)).to.be.rejectedWith(/404/).notify(done);
    // });
  });
})
//https://horizon-testnet.stellar.org
//getAccount(keypair)
//createAccount(sourceKeypair, balance)
//trustAsset(trustKeypair, asset, limit)
//createAssetPayment(sourceKeypair, destination, asset, assetAmount, timeboundsMin, timeboundsMax)
//createChannel(sourceKeypair, destinationPublic, startingBalance, escrowAmount, asset, limit, timeboundsMin, timeboundsMax)
