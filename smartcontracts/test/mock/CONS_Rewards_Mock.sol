pragma solidity ^0.5.0;

import "../../contracts/CONSRewards.sol";

contract CONS_Rewards_Mock is CONSRewards {

    constructor(IERC20 stakingToken, IERC20 carlosTokenMock) public {
        CONS = stakingToken;
        CARLOS = carlosTokenMock;
    }

    modifier checkStart(){
        require(true,"not start");
        _;
    }    

}