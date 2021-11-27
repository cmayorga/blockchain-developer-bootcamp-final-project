const { BN, time } = require('openzeppelin-test-helpers');
const { expect } = require('chai');

const CONS = artifacts.require('CONS_Mock');
const CARLOS = artifacts.require('CARLOS_Mock');
const CONSRewards = artifacts.require('CONS_Rewards_Mock');

//IMPORTANT: Reset garnache-cli before execution in order to start mining blocks from 0
//ganache-cli --gasLimit 0xfffffffffff --port 7545 --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200,1000000000000000000000000"  --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201,1000000000000000000000000" --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501202,1000000000000000000000000" --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501203,1000000000000000000000000" --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501204,1000000000000000000000000"    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501205,1000000000000000000000000"    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501206,1000000000000000000000000"    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501207,1000000000000000000000000"    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501208,1000000000000000000000000"  --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501209,1000000000000000000000000"

async function timeIncreaseTo (seconds) {
    const delay = 10 - new Date().getMilliseconds();
    await new Promise(resolve => setTimeout(resolve, delay));
    await time.increaseTo(seconds);
}

const logData = function (wkspent, currentEpochReward, rewardRate, blockts, periodFinish){
    console.log("Current reward for "+wkspent+" week:", web3.utils.fromWei(currentEpochReward.toString()), " CARLOS Reward Daily Rate: " + Math.round(web3.utils.fromWei(rewardRate.toString())*100)+"%");
    console.log("Block ts for "+wkspent+" week:[", blockts.toString(), "]  ", new Date(blockts*1000).toString(), "  Next period at:[", periodFinish.toString(), "] ", new Date(periodFinish*1000).toString());           
}

const almostEqualDiv1e18 = function (expectedOrig, actualOrig) {
    const _1e18 = new BN('10').pow(new BN('18'));
    const expected = expectedOrig.div(_1e18);
    const actual = actualOrig.div(_1e18);
    this.assert(
        expected.eq(actual) ||
        expected.addn(1).eq(actual) || expected.addn(2).eq(actual) ||
        actual.addn(1).eq(expected) || actual.addn(2).eq(expected),
        'expected #{act} to be almost equal #{exp}',
        'expected #{act} to be different from #{exp}',
        expectedOrig.toString(),
        actualOrig.toString(),
    );
};

require('chai').use(function (chai, utils) {
    chai.Assertion.overwriteMethod('almostEqualDiv1e18', function (original) {
        return function (value) {
            if (utils.flag(this, 'bignumber')) {
                var expected = new BN(value);
                var actual = new BN(this._obj);
                almostEqualDiv1e18.apply(this, [expected, actual]);
            } else {
                original.apply(this, arguments);
            }
        };
    });
});

contract('CONSRewards', function ([_, wallet1, wallet2, wallet3, wallet4]) {
    describe('CONSRewards', async function () {
        beforeEach(async function () {
            this.CONS = await CONS.new();
            this.CARLOS = await CARLOS.new({from: _ });
            this.pool = await CONSRewards.new(this.CONS.address, this.CARLOS.address);

            await this.CARLOS.addMinter(this.pool.address, { from: _ });
            await this.CARLOS.renounceMinter({ from: _ });

            await this.CONS.mint(wallet1, web3.utils.toWei('1000'));
            await this.CONS.mint(wallet2, web3.utils.toWei('1000'));
            await this.CONS.mint(wallet3, web3.utils.toWei('1000'));
            await this.CONS.mint(wallet4, web3.utils.toWei('1000'));

            await this.CONS.approve(this.pool.address, new BN(2).pow(new BN(255)), { from: wallet1 });
            await this.CONS.approve(this.pool.address, new BN(2).pow(new BN(255)), { from: wallet2 });
            await this.CONS.approve(this.pool.address, new BN(2).pow(new BN(255)), { from: wallet3 });
            await this.CONS.approve(this.pool.address, new BN(2).pow(new BN(255)), { from: wallet4 });
           
            this.started = (await time.latest()).addn(10);
            await timeIncreaseTo(this.started);

            console.log("========================== New test scenario===================================");
            console.log("Starting date for simulated rewarding farm: " + new Date(this.started*1000).toString());

            await this.pool.notifyRewardAmount(web3.utils.toWei('69000'), { from: _ });
        });
           
        it('Two stakers with the different (1:3) stakes wait 2 weeks, staker1 entry in half of week1, staker2 exits in half of week2', async function () {
            // 69000 CARLOS per 2 weeks - 5% reduction
            //
            // 1x: ....+---+------------+ 
            // 3x:         +----+         
            //     
            console.log("Two stakers with the different (1:3) stakes wait 2 weeks, staker1 entry in half of week1, staker2 exits in half of week2");
            console.log("1x: ....+---+------------+ ");
            console.log("3x:         +----+         ");            

            await timeIncreaseTo(this.started.add(time.duration.days(3.5)));
            await this.pool.stake(web3.utils.toWei('1'), { from: wallet1 });            
            await time.increase(time.duration.days(3.5));        
            //await this.pool.stake(web3.utils.toWei('0'), { from: wallet4 }); //to conciliate data at blockchain
            //await this.pool.notifyRewardAmount(web3.utils.toWei('69000'), { from: _ });

            [currentEpochReward,rewardRate,blockts,periodFinish] = await Promise.all([this.pool.currentEpochReward.call(), this.pool.rewardRate.call(), this.pool.blockts.call(),this.pool.periodFinish.call()]);            
            logData("1", currentEpochReward,rewardRate,blockts,periodFinish);
            
            expect(await this.pool.rewardPerToken()).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('29571.42'));
            expect(await this.pool.earned(wallet1)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('29571.42'));
            expect(await this.pool.earned(wallet2)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('0'));

            await this.pool.stake(web3.utils.toWei('3'), { from: wallet2 });
            await time.increase(time.duration.days(3.5));
            await this.pool.exit({ from: wallet2 });

            [currentEpochReward,rewardRate,blockts,periodFinish] = await Promise.all([this.pool.currentEpochReward.call(), this.pool.rewardRate.call(), this.pool.blockts.call(),this.pool.periodFinish.call()]);            
            logData("1.5", currentEpochReward,rewardRate,blockts,periodFinish);
            
            expect(await this.pool.rewardPerToken()).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('32035.79'));
            expect(await this.pool.earned(wallet1)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('32035.79'));
            expect(await this.pool.earned(wallet2)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('0'));

            await time.increase(time.duration.days(3.5));
            //await this.pool.stake(web3.utils.toWei('0'), { from: wallet4 }); //to conciliate data at blockchain
            //await this.pool.notifyRewardAmount(web3.utils.toWei('69000'), { from: _ });

            [currentEpochReward,rewardRate,blockts,periodFinish] = await Promise.all([this.pool.currentEpochReward.call(), this.pool.rewardRate.call(), this.pool.blockts.call(),this.pool.periodFinish.call()]);            
            logData("2", currentEpochReward,rewardRate,blockts,periodFinish);
            
            expect(await this.pool.rewardPerToken()).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('60128.65'));
            expect(await this.pool.earned(wallet1)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('60128.65'));
            expect(await this.pool.earned(wallet2)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('0'));
        });
        
        it('Three stakers with the different (1:3:5) stakes wait 3 weeks, wallet 2 exits at end of week 2, wallet 3 entries at week 2', async function () {
            // 69000 CARLOS per week - 5% reduction for 3 weeks
            //
            // 1x: +----------------+--------+ = 69000/4 = 17250 for 1w   + 65550/9=7283.333333 for 2w       + 62272.5/6=10378.75 for 3w   = Total acc earned 1w2w3w (17250, 24533.33333, 34912.08333)
            // 3x: +----------------+          = 17250*3=51750 for 1w     + 7283.333333*3=21850 for 2w       + 0 for 3w                    = Total acc earned 1w2w3w (51750, 73600, 0 (exited,not present))
            // 5x:         +-----------------+ = 0 for 1w                 + 7283.333333*5=36416.66667 for 2w + 10378.75*5=51893.75 for 3w  = Total acc earned 1w2w3w (0, 36416.66667, 88310.41667)
            //
            console.log("Three stakers with the different (1:3:5) stakes wait 3 weeks");
            console.log("1x: +----------------+--------+ = 69000/4 = 17250 for 1w   + 65550/9=7283.333333 for 2w       + 62272.5/6=10378.75 for 3w   = Total acc earned 1w2w3w (17250, 24533.33333, 34912.08333)");
            console.log("3x: +----------------+          = 17250*3=51750 for 1w     + 7283.333333*3=21850 for 2w       + 0 for 3w                    = Total acc earned 1w2w3w (51750, 73600, 0 (exited,not present))");
            console.log("5x:         +-----------------+ = 0 for 1w                 + 7283.333333*5=36416.66667 for 2w + 10378.75*5=51893.75 for 3w  = Total acc earned 1w2w3w (0, 36416.66667, 88310.41667)");

            await this.pool.stake(web3.utils.toWei('1'), { from: wallet1 });
            await this.pool.stake(web3.utils.toWei('3'), { from: wallet2 });            
            await timeIncreaseTo(this.started.add(time.duration.weeks(1)));
            await this.pool.stake(web3.utils.toWei('5'), { from: wallet3 });
            

            [currentEpochReward,rewardRate,blockts,periodFinish] = await Promise.all([this.pool.currentEpochReward.call(), this.pool.rewardRate.call(), this.pool.blockts.call(),this.pool.periodFinish.call()]);            
            logData("1", currentEpochReward,rewardRate,blockts,periodFinish);

            expect(await this.pool.rewardPerToken()).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('17250'));
            expect(await this.pool.earned(wallet1)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('17250'));
            expect(await this.pool.earned(wallet2)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('51750'));

            await time.increase(time.duration.weeks(1));            
            //await this.pool.stake(web3.utils.toWei('0'), { from: wallet4 }); //to conciliate data at blockchain
            //await this.pool.notifyRewardAmount(web3.utils.toWei('69000'), { from: _ });
            await this.pool.addExtraReward(web3.utils.toWei('0'), { from: _ }); //to conciliate data at blockchain

            [currentEpochReward,rewardRate,blockts,periodFinish] = await Promise.all([this.pool.currentEpochReward.call(), this.pool.rewardRate.call(), this.pool.blockts.call(),this.pool.periodFinish.call()]);            
            logData("2", currentEpochReward,rewardRate,blockts,periodFinish);            

            expect(await this.pool.rewardPerToken()).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('24533.33333')); 
            expect(await this.pool.earned(wallet1)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('24533.33333'));
            expect(await this.pool.earned(wallet2)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('73600'));
            expect(await this.pool.earned(wallet3)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('36416.66667'));

            await this.pool.exit({ from: wallet2 });
            await time.increase(time.duration.weeks(1));     
            //await this.pool.notifyRewardAmount(web3.utils.toWei('69000'), { from: _ });

            [currentEpochReward,rewardRate,blockts,periodFinish] = await Promise.all([this.pool.currentEpochReward.call(), this.pool.rewardRate.call(), this.pool.blockts.call(),this.pool.periodFinish.call()]);            
            logData("3", currentEpochReward,rewardRate,blockts,periodFinish);

            expect(await this.pool.rewardPerToken()).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('34912.08333')); 
            expect(await this.pool.earned(wallet1)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('34912.08333'));
            expect(await this.pool.earned(wallet2)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('0')); //Because wallet2 is not in the stakers list now
            expect(await this.pool.earned(wallet3)).to.be.bignumber.almostEqualDiv1e18(web3.utils.toWei('88310.41667'));
        });
        
        it('List of reduction until 0', async function () {
            var currentEpochReward = 69000;
            var wkspent = 1;
            var totalMinted = currentEpochReward;
            while (currentEpochReward > 0.1){
                currentEpochReward = currentEpochReward/1.05;
                totalMinted += currentEpochReward;
                wkspent++;    
            }
            console.log("Total " + wkspent + " weeks at 5% reduction init in 69000 tokens by week with total minted of " + totalMinted + " CARLOS");
        });		      
    });
});