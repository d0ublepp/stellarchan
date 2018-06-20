/*
class StellarSan {
  constructor(server) {
    this.server = {
      loadAccount: function(k) {return k}
    };
  }
  getAccount(keypair) {
    return this.server.loadAccount(keypair);
  }
}

let ss = new StellarSan("hello");
console.log(ss.getAccount("world"));
*/
import StellarChan from '../src/index.js';
import { Server, Keypair } from 'stellar-sdk';

let stellarChan = new StellarChan(new Server("https://horizon-testnet.stellar.org"));
let keypair = Keypair.random();
;(async () => {
try{
await stellarChan.getAccount(keypair)
} catch(err){
  console.log(err);
}
})()
//console.log(stellarChan.greet("peaw "));
/*
;(async () => {
  await stellarChan.getAccount("b")
})()
*/

//let account = stellarChan.getAccount(keypair);
//console.log(account);
