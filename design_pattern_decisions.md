
# Use Openzeppelin libraries

I used next tested libraries in my contract, they are flattened in one single file to make it readable and understable:

@openzeppelin/contracts/math/Math.so
@openzeppelin/contracts/math/SafeMath.sol
@openzeppelin/contracts/GSN/Context.sol
@openzeppelin/contracts/ownership/Ownable.sol
@openzeppelin/contracts/token/ERC20/IERC20.sol
@openzeppelin/contracts/utils/Address.sol
@openzeppelin/contracts/token/ERC20/SafeERC20.sol

# Using interfaces and inter-contract execution

Also i use IERC20 interface for mainly two functions:

1.- To mint CARLOS reward token, as CONSRewards is a minter we prevously added to CARLOS ERC20

2.- To allow contract to stake and unstake CONS tokens with the approval of the user