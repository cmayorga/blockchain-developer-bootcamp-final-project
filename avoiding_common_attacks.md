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

# Example of SWC-115 mitigation

in this function at LPTokenWrapper we used msg.sender instead of tx.origin

<code>
    function stake(uint256 amount) public {
        address sender = msg.sender;
        require(!address(sender).isContract(), "plz farm by hand");
        require(tx.origin == sender, "plz farm by hand");
        _totalSupply = _totalSupply.add(amount);
        _balances[sender] = _balances[sender].add(amount);
        CONS.transferFrom(sender, address(this), amount);  //TBD, in mainnet SafeERC20, previous line
    }
</code>

# Other security issues mitigation

Smart contract passed Consensys MythX.io Deep scan to avoid security issues and common attacks
