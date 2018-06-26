import * as StellarSDK from 'stellar-sdk';
import sinon from 'sinon';
import axios from 'axios';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import StellarChan from '../src/index';

chai.use(chaiAsPromised);
chai.should();

const mockLoadAccountResponse = require('./load-account-response.json');

const stellarBaseUrl = 'https://horizon-testnet.stellar.org';
// Public Key GBHJBUYVS4HABBRR7WOWROCVYEUZP5KQVWO2NH454OY2ESDEE2ZI4UAQ
// Secret Key SB7ZCAVZZAZGPYUREEVZKK4WAZE7EVAMIM2GPTC3ALORDLFQZXPG2VKM
const mockKeypair = StellarSDK.Keypair.fromSecret('SB7ZCAVZZAZGPYUREEVZKK4WAZE7EVAMIM2GPTC3ALORDLFQZXPG2VKM');
let axiosMock = null;

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
    axiosMock = sinon.mock(axios);
    done();
  });

  afterEach((done) => {
    axiosMock.verify();
    axiosMock.restore();
    done();
  });

  describe('getAccount', () => {
    it('returns correct account object!', async () => {
      axiosMock
        .expects('get')
        .atLeast(1)
        .withArgs(sinon.match(`${stellarBaseUrl}/accounts/${mockKeypair.publicKey()}`))
        .returns(Promise.resolve({
          data: mockLoadAccountResponse,
        }));

      const expected = await new StellarSDK.Server(stellarBaseUrl).loadAccount(mockKeypair.publicKey());

      const stellarChan = new StellarChan(new StellarSDK.Server(stellarBaseUrl));
      const setllarAccount = await stellarChan.getAccount(mockKeypair);

      chai.expect(onlyNonFunctions(setllarAccount)).to.deep.equal(onlyNonFunctions(expected));
    });

    // it('error 404', function(done) {
    //     let stellarChan = new StellarChan(new StellarSDK.Server("https://horizon-live.stellar.org:1337"));
    //     let keypair = StellarSDK.Keypair.random();
    //     expect(stellarChan.getAccount(keypair)).to.be.rejectedWith(/404/).notify(done);
    // });
  });
  describe('createAccount', () => {
    it('returns correct payment operation!', async () => {
      const fixedKeyPair = StellarSDK.Keypair.random();
      const randomKeyPairStub = sinon.stub(StellarSDK.Keypair, 'random')
        .returns(fixedKeyPair);

      axiosMock
        .expects('get')
        .atLeast(1)
        .withArgs(sinon.match(`${stellarBaseUrl}/accounts/${mockKeypair.publicKey()}`))
        .returns(Promise.resolve({
          data: mockLoadAccountResponse,
        }));

      axiosMock
        .expects('post')
        .atLeast(1)
        .withArgs(sinon.match(`${stellarBaseUrl}/transactions`, sinon.match.string))
        .returns(Promise.resolve({
          data: {},
        }));
      const stellarChan = new StellarChan(new StellarSDK.Server(stellarBaseUrl));
      const stellarChanSpy = sinon.spy(stellarChan.server, 'submitTransaction');
      StellarSDK.Config.setDefault();
      StellarSDK.Network.useTestNetwork();
      const result = await stellarChan.createAccount(mockKeypair, '1');
      chai.expect(stellarChanSpy.args[0][0].operations[0].type).to.equal('createAccount');
      chai.expect(stellarChanSpy.args[0][0].operations[0].startingBalance).to.equal('1');
      chai.expect(stellarChanSpy.args[0][0].operations[0].destination).to.equal(fixedKeyPair.publicKey());
    });
  });
  describe('trustAsset', () => {
    it('returns correct changeTrust operation!', async () => {
      axiosMock
        .expects('get')
        .atLeast(1)
        .withArgs(sinon.match(`${stellarBaseUrl}/accounts/${mockKeypair.publicKey()}`))
        .returns(Promise.resolve({
          data: mockLoadAccountResponse,
        }));

      axiosMock
        .expects('post')
        .atLeast(1)
        .withArgs(sinon.match(`${stellarBaseUrl}/transactions`, sinon.match.string))
        .returns(Promise.resolve({
          data: {},
        }));
      const asset = new StellarSDK.Asset("KC", 'GCDNS25KCS7OGRQ2XFIENQWMSQ2RWLUNYGOEEE22KOCPOSCCCK2WNIIL');
      const stellarChan = new StellarChan(new StellarSDK.Server(stellarBaseUrl));
      const stellarChanSpy = sinon.spy(stellarChan.server, 'submitTransaction');
      StellarSDK.Config.setDefault();
      StellarSDK.Network.useTestNetwork();
      const result = await stellarChan.trustAsset(mockKeypair, asset, '1');
      chai.expect(stellarChanSpy.args[0][0].operations[0].type).to.equal('changeTrust');
      chai.expect(stellarChanSpy.args[0][0].operations[0].line).to.deep.equal(asset);
    });
  });
  describe('createAssetPayment', () => {
    it('returns correct createAssetPayment operation!', async () => {
      axiosMock
        .expects('get')
        .atLeast(1)
        .withArgs(sinon.match(`${stellarBaseUrl}/accounts/${mockKeypair.publicKey()}`))
        .returns(Promise.resolve({
          data: mockLoadAccountResponse,
        }));

      axiosMock
        .expects('post')
        .atLeast(1)
        .withArgs(sinon.match(`${stellarBaseUrl}/transactions`, sinon.match.string))
        .returns(Promise.resolve({
          data: {},
        }));
      const asset = new StellarSDK.Asset("KC", 'GCDNS25KCS7OGRQ2XFIENQWMSQ2RWLUNYGOEEE22KOCPOSCCCK2WNIIL');
      const stellarChan = new StellarChan(new StellarSDK.Server(stellarBaseUrl));
      const stellarChanSpy = sinon.spy(stellarChan.server, 'submitTransaction');
      const destination = 'GBJ2UUQCLC66PQRPVHLA46CQFHKYCDDGIP6RY6TMDWAH2UBNL45GLKGO';
      StellarSDK.Config.setDefault();
      StellarSDK.Network.useTestNetwork();
      const result = await stellarChan.createAssetPayment(
        mockKeypair,
        destination,
        asset,
        '1',
        '1529984170',
        '1529984270',
      );
     chai.expect(stellarChanSpy.args[0][0].operations[0].type).to.equal('payment');
     chai.expect(stellarChanSpy.args[0][0].operations[0].destination).to.equal(destination);
     chai.expect(stellarChanSpy.args[0][0].operations[0].asset).to.deep.equal(asset);
     chai.expect(stellarChanSpy.args[0][0].operations[0].amount).to.deep.equal('1');


    });
  });
});
/* eslint-disable max-len */
