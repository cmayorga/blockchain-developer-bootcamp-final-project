pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";


contract IRewardDistributionRecipient is Ownable {
    address public rewardDistributor;

    function notifyRewardAmount(uint256 reward) external;

    modifier onlyRewardDistributor() {
        require(_msgSender() == rewardDistributor, "Caller is not reward distributor");
        _;
    }

    function setRewardDistributor(address _rewardDistributor)
        external
        onlyOwner
    {
        rewardDistributor = _rewardDistributor;
    }
}
