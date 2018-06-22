import { expect, should, use } from 'chai';
import * as StellarSDK from 'stellar-sdk';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import * as axios from 'axios';
import StellarChan from '../src/index';

use(chaiAsPromised);
should();

const mockLoadAccountResponse = require('./load-account-response.json');

const stellarBaseUrl = 'https://horizon-live.stellar.org:1337';
const testAccountAddress = 'GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS';

// const StellarChanLib = require("../src/index.js");

const onlyNonFunctions = (obj) => {
  const r = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      r[key] = onlyNonFunctions(obj[key]);
    } else if (typeof obj[key] !== 'function') {
      r[key] = obj[key];
    }
  });
};

describe('StellarChan', () => {
  beforeEach((done) => {
    this.axiosMock = sinon.mock(axios);
    done();
  });

  afterEach((done) => {
    this.axiosMock.verify();
    this.axiosMock.restore();
    done();
  });

  describe('getAccount', () => {
    it('returns correct account object!', async () => {
      this.axiosMock
        .expects('get')
        .atLeast(1)
        .withArgs(sinon.match(`${stellarBaseUrl}/accounts/${testAccountAddress}`))
        .returns(Promise.resolve({ data: mockLoadAccountResponse }));

      const mockKeypair = {
        publicKey: () => testAccountAddress,
      };

      const expected = await new StellarSDK.Server(stellarBaseUrl).loadAccount(testAccountAddress);

      const stellarChan = new StellarChan(new StellarSDK.Server(stellarBaseUrl));
      const setllarAccount = await stellarChan.getAccount(mockKeypair);

      /* eslint-disable max-len */
      // expect(stellarChan.getAccount(mockKeypair).then(res => Promise.resolve(onlyNonFunctions(res))) ).to.eventually.equal(onlyNonFunctions(expected)).notify(done)
      /* eslint-enable max-len */

      expect(onlyNonFunctions(setllarAccount)).to.deep.equal(onlyNonFunctions(expected));
    });

    // it('error 404', function(done) {
    //     let stellarChan = new StellarChan(new StellarSDK.Server("https://horizon-live.stellar.org:1337"));
    //     let keypair = StellarSDK.Keypair.random();
    //     expect(stellarChan.getAccount(keypair)).to.be.rejectedWith(/404/).notify(done);
    // });
  });
});

/* eslint-disable max-len */
// https://horizon-testnet.stellar.org
// getAccount(keypair)
// createAccount(sourceKeypair, balance)
// trustAsset(trustKeypair, asset, limit)
// createAssetPayment(sourceKeypair, destination, asset, assetAmount, timeboundsMin, timeboundsMax)
// createChannel(sourceKeypair, destinationPublic, startingBalance, escrowAmount, asset, limit, timeboundsMin, timeboundsMax)
