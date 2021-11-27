CONS ERC20 token to stake and get rewards: Created and verified at https://ropsten.etherscan.io/address/0x69fae47f4a2d01f66b29e068a62e89e150b9a1d1

CARLOS ERC20 is the token we will use as reward token for farmers: Created and verified at https://ropsten.etherscan.io/address/0xc37f866b567127b2933781f6c5572389291cbe99

We need all to be mintable to add supply and add liquidity to the pool

I will execute addMinter in CONS tokens to get some paper tokens in my account to use to stake them

CONS 

addMinter tx https://ropsten.etherscan.io/tx/0xea093f3f71786344ffbd61fdf13105a8c6dc017ffd9a417bc4c501232f238e06

mint 100000000000000000000000000 tx https://ropsten.etherscan.io/tx/0x6fdaa57bd32c987d6dd89164061537a4fa4abb7642ffa377e56e4f7f0f703417

Now we configure (hardcoding our CONS token to access by interface) our CONSRewards contract, deploy and verify it:

CONSRewards contract: https://ropsten.etherscan.io/address/0xcf87c85097ac3c8af52e8b29bff1fbb38068e35c

Now we need to add this contract as minter at CARLOS reward token in order to allow Reward contract to mint and transfer tokens to farmers.

Minter added tx: https://ropsten.etherscan.io/tx/0x84b87dbf277bee8aaf8903e07f30dc8fc43ef49ca78dab760ec891991e5f3aad

Next step is to start the farm, so we execute notifyRewardAmount at CONSReward contract by owner

tx: https://ropsten.etherscan.io/tx/0x681f1ef1062ac834f5f323ecd4671f844d58410b2a29a78ded6402a19f9e0667