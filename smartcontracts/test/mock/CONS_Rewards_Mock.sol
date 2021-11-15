pragma solidity ^0.5.0;

import "../../contracts/CONSRewards.sol";

contract CONS_Rewards_Mock is CONSRewards {

    constructor(IERC20 uniswapV2TokenMock, IERC20 carlosTokenMock) public {
        CONSWETH_UniswapV2Pair = uniswapV2TokenMock;
        CARLOS = carlosTokenMock;
    }

    modifier checkStart(){
        require(true,"not start");
        _;
    }    

}