# Consensys Blockchain Developer BootCamp Final Project

My public ETH address to receive NFT certificate: 0xcc44de3f360216B65130A124C716D7AA98407BCb

Project is deployed and running at https://cmayorgaconsensys.surge.sh/

Video screencast is available at https://www.loom.com/share/cce704bf6eac483a81702f9cddf2248b

The project is a simple farming system where the user can stake his CONS tokens to receive CARLOS tokens as rewards.

I used well know libraries from openzeppelin both for contracts and for unit tests. To simplify libraries have been flattened using truffle-flattener in one unique file to make it readable.

We will start distributing 69000 CARLOS tokens as reward, and will reduce this amount 5% each week, when rewards fall below 0 the function setFarmingFinished is executed and farm is finished.

User can stake, unstake, claim rewards and exit at any time.

A system daemon will execute the python script at folder rewards_node_daemon and will notifyReward with that amount weekly

This script receives the CONSReward smart contract owner address and its private key as parameters to execute the notifyReward function.

Contract has been tested using Consensys MythX.io Deep scan services throught VSCode-Extension, detecting 0 high, 0 Medium and 20 low vulnerabilities.

We will use Ropsten as network to do the tests

We need a serie of contracts and tokens to execute our project, we will verify all to use etherscan.io web3 functions as defined in deployed_address.md

## Run frontend

<code>cd frontend</code>

<code>yarn</code>

<code>yarn start</code>

If you want to run weekly daemon to notifyRewards you need to have a server and run with crontab the python script at folder rewards_node_daemon\
Also you can execute that function throught etherscan verified contract with proper owner account

Farm won't start until you execute notifyReward first time, otherwise your transaction will revert with "Farm not started" error.

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

## Test Results

testresult.txt
