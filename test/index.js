import * as StellarSDK from 'stellar-sdk';
import sinon from 'sinon';
import axios from 'axios';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import StellarChan from '../src/index';

chai.use(chaiAsPromised);
chai.should();

const mockLoadAccountResponse = require('./load-account-response.json');

const stellarBaseUrl = 'https://horizon-live.stellar.org:1337';
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
              data: mockLoadAccountResponse
            }));

          const expected = await new StellarSDK.Server(stellarBaseUrl).loadAccount(mockKeypair.publicKey());

          const stellarChan = new StellarChan(new StellarSDK.Server(stellarBaseUrl));
          const setllarAccount = await stellarChan.getAccount(mockKeypair);

          /* eslint-disable max-len */
          // expect(stellarChan.getAccount(mockKeypair).then(res => Promise.resolve(onlyNonFunctions(res))) ).to.eventually.equal(onlyNonFunctions(expected)).notify(done)
          /* eslint-enable max-len */

          chai.expect(onlyNonFunctions(setllarAccount)).to.deep.equal(onlyNonFunctions(expected));
        });

        // it('error 404', function(done) {
        //     let stellarChan = new StellarChan(new StellarSDK.Server("https://horizon-live.stellar.org:1337"));
        //     let keypair = StellarSDK.Keypair.random();
        //     expect(stellarChan.getAccount(keypair)).to.be.rejectedWith(/404/).notify(done);
        // });
      });
      describe('createAccount', () => {
        it('returns correct account object!', async () => {
          axiosMock
            .expects('get')
            .atLeast(1)
            .withArgs(sinon.match(`${stellarBaseUrl}/accounts/${mockKeypair.publicKey()}`))
            .returns(Promise.resolve({
              data: mockLoadAccountResponse
            }));

          axiosMock
            .expects('post')
            .atLeast(1)
            .withArgs(sinon.match(`${stellarBaseUrl}/transactions`, sinon.match.string))
            .returns(Promise.resolve({
              data: {}
            }));

          const stellarChan = new StellarChan(new StellarSDK.Server(stellarBaseUrl));
          StellarSDK.Config.setDefault();
          StellarSDK.Network.useTestNetwork();
          const result = stellarChan.createAccount(mockKeypair,"1");
        });
      });
});
      /* eslint-disable max-len */
