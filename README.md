# Consensys Blockchain Developer BootCamp Final Project

My public ETH address to receive NFT certificate: 0xcc44de3f360216B65130A124C716D7AA98407BCb

Project is deployed and running at https://cmayorgaconsensys.surge.sh/

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

  Contract: CONSRewards
    CONSRewards
========================== New test scenario===================================
Starting date for simulated rewarding farm: Sat Nov 27 2021 16:39:45 GMT+0100 (hora estándar de Europa central)
Two stakers with the different (1:3) stakes wait 2 weeks, staker1 entry in half of week1, staker2 exits in half of week2
1x: ....+---+------------+
3x:         +----+
Current reward for 1 week: 69000  CARLOS Reward Daily Rate: 11%
Block ts for 1 week:[ 1638286786 ]   Tue Nov 30 2021 16:39:46 GMT+0100 (hora estándar de Europa central)   Next period at:[ 1638632385 ]  Sat Dec 04 2021 16:39:45 GMT+0100 (hora estándar de Europa central)
Current reward for 1.5 week: 65550  CARLOS Reward Daily Rate: 11%
Block ts for 1.5 week:[ 1638805188 ]   Mon Dec 06 2021 16:39:48 GMT+0100 (hora estándar de Europa central)   Next period at:[ 1639409988 ]  Mon Dec 13 2021 16:39:48 GMT+0100 (hora estándar de Europa central)
Current reward for 2 week: 65550  CARLOS Reward Daily Rate: 11%
Block ts for 2 week:[ 1638805188 ]   Mon Dec 06 2021 16:39:48 GMT+0100 (hora estándar de Europa central)   Next period at:[ 1639409988 ]  Mon Dec 13 2021 16:39:48 GMT+0100 (hora estándar de Europa central)
      √ Two stakers with the different (1:3) stakes wait 2 weeks, staker1 entry in half of week1, staker2 exits in half of week2 (5481ms, 486865 gas)
========================== New test scenario===================================
Starting date for simulated rewarding farm: Thu Dec 09 2021 16:40:15 GMT+0100 (hora estándar de Europa central)
Three stakers with the different (1:3:5) stakes wait 3 weeks
1x: +----------------+--------+ = 69000/4 = 17250 for 1w   + 65550/9=7283.333333 for 2w       + 62272.5/6=10378.75 for 3w   = Total acc earned 1w2w3w (17250, 24533.33333, 34912.08333)
3x: +----------------+          = 17250*3=51750 for 1w     + 7283.333333*3=21850 for 2w       + 0 for 3w                    = Total acc earned 1w2w3w (51750, 73600, 0 (exited,not present))
5x:         +-----------------+ = 0 for 1w                 + 7283.333333*5=36416.66667 for 2w + 10378.75*5=51893.75 for 3w  = Total acc earned 1w2w3w (0, 36416.66667, 88310.41667)
Current reward for 1 week: 65550  CARLOS Reward Daily Rate: 11%
Block ts for 1 week:[ 1639669216 ]   Thu Dec 16 2021 16:40:16 GMT+0100 (hora estándar de Europa central)   Next period at:[ 1640274016 ]  Thu Dec 23 2021 16:40:16 GMT+0100 (hora estándar de Europa central)
Current reward for 2 week: 62272.5  CARLOS Reward Daily Rate: 10%
Block ts for 2 week:[ 1640274017 ]   Thu Dec 23 2021 16:40:17 GMT+0100 (hora estándar de Europa central)   Next period at:[ 1640878817 ]  Thu Dec 30 2021 16:40:17 GMT+0100 (hora estándar de Europa central)
Current reward for 3 week: 62272.5  CARLOS Reward Daily Rate: 10%
Block ts for 3 week:[ 1640274019 ]   Thu Dec 23 2021 16:40:19 GMT+0100 (hora estándar de Europa central)   Next period at:[ 1640878817 ]  Thu Dec 30 2021 16:40:17 GMT+0100 (hora estándar de Europa central)
      √ Three stakers with the different (1:3:5) stakes wait 3 weeks, wallet 2 exits at end of week 2, wallet 3 entries at week 2 (6636ms, 707940 gas)
========================== New test scenario===================================
Starting date for simulated rewarding farm: Thu Dec 30 2021 16:40:47 GMT+0100 (hora estándar de Europa central)
Total 277 weeks at 5% reduction init in 69000 tokens by week with total minted of 1448998.0428120052 CARLOS
      √ List of reduction until 0 (1ms)

·-----------------------------------------|---------------------------|-------------|----------------------------·
|  Solc version: 0.5.17+commit.d19bba13   ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
··········································|···························|·············|·····························
|  Methods                                                                                                       │
···················|······················|·············|·············|·············|·············|···············
|  Contract        ·  Method              ·  Min        ·  Max        ·  Avg        ·  # calls    ·  usd (avg)   │
···················|······················|·············|·············|·············|·············|···············
|  CARLOS          ·  addMinter           ·      45819  ·      45831  ·      45827  ·          3  ·           -  │
···················|······················|·············|·············|·············|·············|···············
|  CARLOS          ·  mint                ·      51943  ·      66943  ·      55693  ·         12  ·           -  │
···················|······················|·············|·············|·············|·············|···············
|  CONSRewards     ·  addExtraReward      ·          -  ·          -  ·     103577  ·          1  ·           -  │
···················|······················|·············|·············|·············|·············|···············
|  CONSRewards     ·  exit                ·     177623  ·     212827  ·     195225  ·          2  ·           -  │
···················|······················|·············|·············|·············|·············|···············
|  CONSRewards     ·  notifyRewardAmount  ·          -  ·          -  ·     205844  ·          3  ·           -  │
···················|······················|·············|·············|·············|·············|···············
|  ERC20           ·  approve             ·      43977  ·      43989  ·      43985  ·         12  ·           -  │
···················|······················|·············|·············|·············|·············|···············
|  LPTokenWrapper  ·  stake               ·      98337  ·     199592  ·     140156  ·          5  ·           -  │
·------------------|----------------------|-------------|-------------|-------------|-------------|--------------·

  3 passing (1m)

Done in 97.28s.