# BOOTCAMP Consensys Final Project . finance

My public ETH address to receive NFT certificate: 0xcc44de3f360216B65130A124C716D7AA98407BCb

Project is deployed at https://cmayorgaconsensys.surge.sh/

The project is a simple farming system where the user can stake his CONS tokens to receive CARLOS tokens as rewards.

I used well know libraries from openzeppelin both for contracts and for unit tests. To simplify libraries have been flattened using truffle-flattener in one unique file to make it readable.

We will start distributing 69000 CARLOS tokens as reward, and will reduce this amount 5% each week, when rewards fall below 0 the function setFarmingFinished is executed and farm is finished.

User can stake, unstake, claim rewards and exit at any time.

A system daemon will execute the python script at folder rewards_node_daemon and will notifyReward with that amount weekly

This script receives the CONSReward smart contract owner address and its private key as parameters to execute the notifyReward function.

Contract has been tested using Consensys MythX.io Deep scan services throught VSCode-Extension, detecting 0 high, 0 Medium and 20 low vulnerabilities.

We will use Ropsten as network to do the tests

We need a serie of contracts and tokens to execute our project, we will verify all to use etherscan.io web3 functions:

CONS ERC20 token to stake and get rewards: Created and verified at https://ropsten.etherscan.io/address/0x69fae47f4a2d01f66b29e068a62e89e150b9a1d1

CARLOS ERC20 is the token we will use as reward token for farmers: Created and verified at https://ropsten.etherscan.io/address/0xc37f866b567127b2933781f6c5572389291cbe99

We need all to be mintable to add supply and add liquidity to the pool

I will execute addMinter in both WETH and CONS tokens and after i will execute mint to my address in order to have liquidity in both tokens to add to the pool

CONS 

addMinter tx https://ropsten.etherscan.io/tx/0xea093f3f71786344ffbd61fdf13105a8c6dc017ffd9a417bc4c501232f238e06

mint 100000000000000000000000000 tx https://ropsten.etherscan.io/tx/0x6fdaa57bd32c987d6dd89164061537a4fa4abb7642ffa377e56e4f7f0f703417

Now we configure (hardcoding our CONS token to access by interface) our CONSRewards contract, deploy and verify it:

CONSRewards contract: https://ropsten.etherscan.io/address/0xcf87c85097ac3c8af52e8b29bff1fbb38068e35c

Now we need to add this contract as minter at CARLOS reward token in order to allow Reward contract to mint and transfer tokens to farmers.

Minter added tx: https://ropsten.etherscan.io/tx/0x84b87dbf277bee8aaf8903e07f30dc8fc43ef49ca78dab760ec891991e5f3aad

Next step is to start the farm, so we execute notifyRewardAmount at CONSReward contract by owner

tx: https://ropsten.etherscan.io/tx/0x681f1ef1062ac834f5f323ecd4671f844d58410b2a29a78ded6402a19f9e0667

## Run frontend

<code>cd frontend</code>

<code>yarn</code>

<code>yarn start</code>

### Deploy at surge.sh

<code>npm install --global surge</code>

<code>cd frontend</code>

<code>yarn build</code>

<code>cd build</code>

<code>cp index.html 200.html</code>

<code>surge</code>

## Run tests

Tests will run several checks with several accounts doing stake, unstake, claim and exits and getting rewards accordly to the time staked.

<code>cd smartcontracts</code>

<code>yarn ganache-cli</code>   (This will run ganache-cli with 10 funded accounts)

in other terminal run:

<code>yarn test</code> (or <code>yarn test-win </code> if you are using windows)