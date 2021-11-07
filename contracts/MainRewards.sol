// @author: Carlos Mayorga http://github.com/cmayorga

contract MaiRewards is LPTokenWrapper, Ownable {
    IERC20 public REWARDTOKEN = IERC20(0x0000000000000000000000000000000000000000000); //TBD

    uint256 public constant DURATION = 7 days;
    uint256 public currentEpochReward;
    uint256 public fixedCurrentEpochReward;
    uint256 public extraEpochReward = 0;
    uint256 public totalAccumulatedReward = 0;        
    uint256 public starttime = block.timestamp; 
    uint256 public periodFinish = 0;
    bool public rewardSystemFinished = false;    
    uint256 public rewardRate = 0;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public accumulatedStakingPower; // will accumulate every time staker does getReward()

    event RewardAdded(uint256 reward);    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    modifier updateReward(address account) {
        if (!rewardSystemFinished){
            rewardPerTokenStored = rewardPerToken();
            lastUpdateTime = lastTimeRewardApplicable();
        }
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply() == 0) {
            return rewardPerTokenStored;
        }
        return
        rewardPerTokenStored.add(
            lastTimeRewardApplicable()
            .sub(lastUpdateTime)
            .mul(rewardRate)
            .mul(1e18)
            .div(totalSupply())
        );
    }

    function earned(address account) public view returns (uint256) {
        return
            balanceOf(account)
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(1e18)
                .add(rewards[account]);
    }

    function stakingPower(address account) public view returns (uint256) {
        return accumulatedStakingPower[account].add(earned(account));
    }

    function stake(uint256 amount) public updateReward(msg.sender) checkNextEpoch checkStart {
        require(amount > 0, "Cannot stake 0");
        super.stake(amount);        
        emit Staked(msg.sender, amount);  
    }

    function withdraw(uint256 amount) public updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        super.withdraw(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function exit() external {
        withdraw(balanceOf(msg.sender));
        getReward();
    }

    function getReward() public updateReward(msg.sender) checkStart checkNextEpoch{
        uint256 reward = earned(msg.sender);
        if (reward > 0) {
            accumulatedStakingPower[msg.sender] = accumulatedStakingPower[msg.sender].add(rewards[msg.sender]);
            rewards[msg.sender] = 0;
            REWARDTOKEN.safeTransfer(msg.sender, reward);            
            emit RewardPaid(msg.sender, reward);
        }
    }

    function addExtraReward(uint256 extrareward) external onlyOwner checkStart rewardSystemActive {        
        extraEpochReward = extraEpochReward.add(extrareward);
        notifyAddedReward();
    }

    modifier checkNextEpoch() {               
        if (block.timestamp >= periodFinish && !rewardSystemFinished) {
            fixedCurrentEpochReward = fixedCurrentEpochReward - fixedCurrentEpochReward.mul(5).div(100); // -5% each Epoch
            if (fixedCurrentEpochReward > 1) {                
                currentEpochReward = fixedCurrentEpochReward.add(extraEpochReward);
                extraEpochReward = 0;
                totalAccumulatedReward = totalAccumulatedReward.add(currentEpochReward);
                rewardRate = currentEpochReward.div(DURATION);                
                periodFinish = block.timestamp.add(DURATION);      
                //Only mint fixed reward, extra rewards come from transfer from casino games          
                BRADS.mint(address(this), fixedCurrentEpochReward);
                emit RewardAdded(currentEpochReward);                
            }else{
                rewardSystemFinished = true;
            }
            lastUpdateTime = block.timestamp;
        }
        _;
    }

    modifier checkStart() {
        require(block.timestamp > starttime, "not start");
        require(periodFinish > 0, "Pool has not started");        
        _;
    }

    modifier rewardSystemActive(){
        require(!rewardSystemFinished, "Farming is finished yet");
        _;
    }

    function notifyAddedReward() internal onlyOwner updateReward(address(0)) checkNextEpoch{}
    
    function notifyRewardAmount(uint256 reward) external onlyOwner updateReward(address(0)) {
        require(periodFinish == 0, "Only can call once to start staking");
        starttime = block.timestamp;
        currentEpochReward = reward;
        fixedCurrentEpochReward = reward;
        totalAccumulatedReward = totalAccumulatedReward.add(reward);
        rewardRate = currentEpochReward.div(DURATION);        
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(DURATION);
        REWARDTOKEN.mint(address(this), currentEpochReward);
        emit RewardAdded(currentEpochReward);
    }  
}