var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'Seed phrase from Metamask';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 6721975,
      gasPrice: 20000000000, // web3.eth.gasPrice
      time: 1636934400, //Block 0 start at (GMT): Monday, 15 November 2021 0:00:00 https://www.epochconverter.com/
    },
    coverage: {
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 6721975,
      gasPrice: 20000000000, // web3.eth.gasPrice
      time: 1636934400, //Block 0 start at (GMT): Monday, 15 November 2021 0:00:00 https://www.epochconverter.com/
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/52cea3dbdcb8449fb3653e94d710a25a")
      },
      network_id: 3,
      gas: 6721975      //make sure this gas allocation isn't over 4M, which is the max
    }    
  },
  compilers: {
    solc: {
      version: '0.5.17',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    },
  },
  mocha: { // https://github.com/cgewecke/eth-gas-reporter
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      gasPrice: 10,
      onlyCalledMethods: true,
      showTimeSpent: true,
      excludeContracts: ['Migrations']
    }
  }
};
