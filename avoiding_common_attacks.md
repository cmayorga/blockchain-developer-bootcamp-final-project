# Example of SWC-107 mitigation

In this function we update rewards user to 0 before execute safeTransfer function

<code>
    function getReward() public updateReward(msg.sender) checkStart checkNextEpoch{
        uint256 reward = earned(msg.sender);
        if (reward > 0) {
            accumulatedStakingPower[msg.sender] = accumulatedStakingPower[msg.sender].add(rewards[msg.sender]);
            rewards[msg.sender] = 0;
            CARLOS.safeTransfer(msg.sender, reward);            
            emit RewardPaid(msg.sender, reward);
        }
    }
</code>

Smart contract passed Consensys MythX.io Deep scan to avoid security issues and common attacks
