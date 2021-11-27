#only for CONSRewards v2

import json
import web3
import sys
from web3 import Web3
import time;
from datetime import datetime,timezone

if len(sys.argv) < 3:
    print("Usage details: rewards_daemon.py owner_address owneraddres_private_key")
    exit()

#CONSUser = "0xFC8d59ed72dc74007131e894cf1Be9Ea9A38C554"

CONSRewards_address = "0xcf87c85097ac3c8af52e8b29bff1fbb38068e35c"
eth_url = "https://ropsten.infura.io/v3/17aaa2ed017c44edaf69e8859d2cd89c" #CARLOS
web3 = Web3(Web3.HTTPProvider(eth_url))
chainId = 3 #Ropsten

owner_address = web3.toChecksumAddress(sys.argv[1])  #  CONSRewards Owner address
owner_pc = sys.argv[2] # CONSRewards Owner address Private key
address = web3.toChecksumAddress(CONSRewards_address)

#CONS Rewards smart contract: abi, address and bytecode
abi = json.loads('[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"constant":true,"inputs":[],"name":"CARLOS","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CONS","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"accumulatedStakingPower","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"extrareward","type":"uint256"}],"name":"addExtraReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"blockts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentEpochReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"earned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"extraEpochReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fixedCurrentEpochReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastTimeRewardApplicable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastUpdateTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"notifyRewardAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"periodFinish","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerTokenStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardSystemFinished","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bool","name":"finished","type":"bool"}],"name":"setFarmingFinished","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"stakingPower","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"starttime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalAccumulatedReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userRewardPerTokenPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]')
bytecode = "6080604052600080546001600160a01b0319908116739f0523e2194873227b9d462ed0970a3debb634a9178255600480549091167344c20d6869ec46b78e76bd9c051518476a9bbdc017905560078190556008819055426009819055600a829055600b805460ff19169055600c55600d556100816001600160e01b036100d216565b600380546001600160a01b0319166001600160a01b0392831617908190556040519116906000907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a36100d6565b3390565b611a4b806100e56000396000f3fe608060405234801561001057600080fd5b50600436106102055760003560e01c80638da588971161011a578063ddc2b169116100ad578063e9fad8ee1161007c578063e9fad8ee14610437578063ebe2b12b1461043f578063ed92091414610447578063f2fde38b1461044f578063ffe489021461047557610205565b8063ddc2b169146103f9578063df136d6514610401578063e68e035b14610409578063e9b46e6d1461041157610205565b8063a694fc3a116100e9578063a694fc3a146103c4578063c8f33c91146103e1578063cd3daf9d146103e9578063d3d4a5af146103f157610205565b80638da58897146103745780638da5cb5b1461037c5780638f32d59b146103a05780639c916d19146103bc57610205565b806353cef1d21161019d5780637b0a47ee1161016c5780637b0a47ee1461032e5780637e126d98146103365780637fba03a01461033e57806380faa57d146103465780638b8763471461034e57610205565b806353cef1d2146102c4578063635cb4e2146102e357806370a0823114610300578063715018a61461032657610205565b8063207e821d116101d9578063207e821d146102785780632e1a7d4d146102805780633c6b16ab1461029f5780633d18b912146102bc57610205565b80628cc2621461020a5780630700037d1461024257806318160ddd146102685780631be0528914610270575b600080fd5b6102306004803603602081101561022057600080fd5b50356001600160a01b031661049b565b60408051918252519081900360200190f35b6102306004803603602081101561025857600080fd5b50356001600160a01b0316610521565b610230610533565b61023061053a565b610230610541565b61029d6004803603602081101561029657600080fd5b5035610547565b005b61029d600480360360208110156102b557600080fd5b503561063a565b61029d610819565b61029d600480360360208110156102da57600080fd5b50351515610b83565b61029d600480360360208110156102f957600080fd5b5035610be1565b6102306004803603602081101561031657600080fd5b50356001600160a01b0316610ca1565b61029d610cbc565b610230610d4d565b610230610d53565b610230610d59565b610230610d5f565b6102306004803603602081101561036457600080fd5b50356001600160a01b0316610d72565b610230610d84565b610384610d8a565b604080516001600160a01b039092168252519081900360200190f35b6103a8610d99565b604080519115158252519081900360200190f35b610384610dbf565b61029d600480360360208110156103da57600080fd5b5035610dce565b6102306110ac565b6102306110b2565b610230611106565b6103a861110c565b610230611115565b61023061111b565b6102306004803603602081101561042757600080fd5b50356001600160a01b0316611121565b61029d611133565b61023061114e565b610384611154565b61029d6004803603602081101561046557600080fd5b50356001600160a01b0316611163565b6102306004803603602081101561048b57600080fd5b50356001600160a01b03166111b3565b6001600160a01b038116600090815260116020908152604080832054601090925282205461051b919061050f90670de0b6b3a764000090610503906104ee906104e26110b2565b9063ffffffff6111e616565b6104f788610ca1565b9063ffffffff61122f16565b9063ffffffff61128816565b9063ffffffff6112ca16565b92915050565b60116020526000908152604090205481565b6001545b90565b62093a8081565b60085481565b600b54339060ff1661056a5761055b6110b2565b600f55610566610d5f565b600e555b6001600160a01b038116156105ae576105828161049b565b6001600160a01b038216600090815260116020908152604080832093909355600f546010909152919020555b600082116105f7576040805162461bcd60e51b8152602060048201526011602482015270043616e6e6f74207769746864726177203607c1b604482015290519081900360640190fd5b61060082611324565b60408051838152905133917f7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5919081900360200190a25050565b610642610d99565b610681576040805162461bcd60e51b815260206004820181905260248201526000805160206119d4833981519152604482015290519081900360640190fd5b600b5460009060ff166106a5576106966110b2565b600f556106a1610d5f565b600e555b6001600160a01b038116156106e9576106bd8161049b565b6001600160a01b038216600090815260116020908152604080832093909355600f546010909152919020555b600a54156107285760405162461bcd60e51b81526004018080602001828103825260238152602001806119f46023913960400191505060405180910390fd5b4260095560058290556006829055600854610749908363ffffffff6112ca16565b6008556005546107629062093a8063ffffffff61128816565b600d5542600e81905561077e9062093a8063ffffffff6112ca16565b600a5560048054600554604080516340c10f1960e01b815230948101949094526024840191909152516001600160a01b03909116916340c10f1991604480830192600092919082900301818387803b1580156107d957600080fd5b505af11580156107ed573d6000803e3d6000fd5b505060055460408051918252516000805160206119938339815191529350908190036020019150a15050565b600b54339060ff1661083c5761082d6110b2565b600f55610838610d5f565b600e555b6001600160a01b03811615610880576108548161049b565b6001600160a01b038216600090815260116020908152604080832093909355600f546010909152919020555b60095442116108c2576040805162461bcd60e51b81526020600482015260096024820152681b9bdd081cdd185c9d60ba1b604482015290519081900360640190fd5b6000600a5411610910576040805162461bcd60e51b8152602060048201526014602482015273141bdbdb081a185cc81b9bdd081cdd185c9d195960621b604482015290519081900360640190fd5b42600c819055600a541180159061092a5750600b5460ff16155b15610a6e5761094a6064610503600560065461122f90919063ffffffff16565b6006540360068190555060016006541115610a5b576007546006546109749163ffffffff6112ca16565b600581905560006007556008546109909163ffffffff6112ca16565b6008556005546109a99062093a8063ffffffff61128816565b600d556109bf4262093a8063ffffffff6112ca16565b600a5560048054600654604080516340c10f1960e01b815230948101949094526024840191909152516001600160a01b03909116916340c10f1991604480830192600092919082900301818387803b158015610a1a57600080fd5b505af1158015610a2e573d6000803e3d6000fd5b505060055460408051918252516000805160206119938339815191529350908190036020019150a1610a69565b600b805460ff191660011790555b42600e555b6000610a793361049b565b90508015610b7f5733600090815260116020908152604080832054601290925290912054610aac9163ffffffff6112ca16565b336000818152601260209081526040808320949094556011815283822082905560048054855163a9059cbb60e01b8152918201949094526024810186905293516001600160a01b039093169363a9059cbb9360448083019491928390030190829087803b158015610b1c57600080fd5b505af1158015610b30573d6000803e3d6000fd5b505050506040513d6020811015610b4657600080fd5b505060408051828152905133917fe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486919081900360200190a25b5050565b610b8b610d99565b610bca576040805162461bcd60e51b815260206004820181905260248201526000805160206119d4833981519152604482015290519081900360640190fd5b42600e55600b805460ff1916911515919091179055565b610be9610d99565b610c28576040805162461bcd60e51b815260206004820181905260248201526000805160206119d4833981519152604482015290519081900360640190fd5b600b5460ff1615610c80576040805162461bcd60e51b815260206004820152601760248201527f4661726d696e672069732066696e697368656420796574000000000000000000604482015290519081900360640190fd5b600754610c93908263ffffffff6112ca16565b600755610c9e6113ed565b50565b6001600160a01b031660009081526002602052604090205490565b610cc4610d99565b610d03576040805162461bcd60e51b815260206004820181905260248201526000805160206119d4833981519152604482015290519081900360640190fd5b6003546040516000916001600160a01b0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600380546001600160a01b0319169055565b600d5481565b60065481565b600c5481565b6000610d6d42600a546115fc565b905090565b60106020526000908152604090205481565b60095481565b6003546001600160a01b031690565b6003546000906001600160a01b0316610db0611612565b6001600160a01b031614905090565b6000546001600160a01b031681565b600b54339060ff16610df157610de26110b2565b600f55610ded610d5f565b600e555b6001600160a01b03811615610e3557610e098161049b565b6001600160a01b038216600090815260116020908152604080832093909355600f546010909152919020555b42600c819055600a5411801590610e4f5750600b5460ff16155b15610f9357610e6f6064610503600560065461122f90919063ffffffff16565b6006540360068190555060016006541115610f8057600754600654610e999163ffffffff6112ca16565b60058190556000600755600854610eb59163ffffffff6112ca16565b600855600554610ece9062093a8063ffffffff61128816565b600d55610ee44262093a8063ffffffff6112ca16565b600a5560048054600654604080516340c10f1960e01b815230948101949094526024840191909152516001600160a01b03909116916340c10f1991604480830192600092919082900301818387803b158015610f3f57600080fd5b505af1158015610f53573d6000803e3d6000fd5b505060055460408051918252516000805160206119938339815191529350908190036020019150a1610f8e565b600b805460ff191660011790555b42600e555b6009544211610fd5576040805162461bcd60e51b81526020600482015260096024820152681b9bdd081cdd185c9d60ba1b604482015290519081900360640190fd5b6000600a5411611023576040805162461bcd60e51b8152602060048201526014602482015273141bdbdb081a185cc81b9bdd081cdd185c9d195960621b604482015290519081900360640190fd5b60008211611069576040805162461bcd60e51b815260206004820152600e60248201526d043616e6e6f74207374616b6520360941b604482015290519081900360640190fd5b61107282611616565b60408051838152905133917f9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d919081900360200190a25050565b600e5481565b60006110bc610533565b6110c95750600f54610537565b610d6d6110f76110d7610533565b610503670de0b6b3a76400006104f7600d546104f7600e546104e2610d5f565b600f549063ffffffff6112ca16565b60075481565b600b5460ff1681565b600f5481565b60055481565b60126020526000908152604090205481565b61114461113f33610ca1565b610547565b61114c610819565b565b600a5481565b6004546001600160a01b031681565b61116b610d99565b6111aa576040805162461bcd60e51b815260206004820181905260248201526000805160206119d4833981519152604482015290519081900360640190fd5b610c9e81611793565b600061051b6111c18361049b565b6001600160a01b0384166000908152601260205260409020549063ffffffff6112ca16565b600061122883836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250611834565b9392505050565b60008261123e5750600061051b565b8282028284828161124b57fe5b04146112285760405162461bcd60e51b81526004018080602001828103825260218152602001806119b36021913960400191505060405180910390fd5b600061122883836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f0000000000008152506118cb565b600082820183811015611228576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b600154611337908263ffffffff6111e616565b6001553360009081526002602052604090205461135a908263ffffffff6111e616565b336000818152600260209081526040808320949094558154845163a9059cbb60e01b815260048101949094526024840186905293516001600160a01b039094169363a9059cbb93604480820194918390030190829087803b1580156113be57600080fd5b505af11580156113d2573d6000803e3d6000fd5b505050506040513d60208110156113e857600080fd5b505050565b6113f5610d99565b611434576040805162461bcd60e51b815260206004820181905260248201526000805160206119d4833981519152604482015290519081900360640190fd5b600b5460009060ff16611458576114496110b2565b600f55611454610d5f565b600e555b6001600160a01b0381161561149c576114708161049b565b6001600160a01b038216600090815260116020908152604080832093909355600f546010909152919020555b42600c819055600a54118015906114b65750600b5460ff16155b15610c9e576114d66064610503600560065461122f90919063ffffffff16565b60065403600681905550600160065411156115e7576007546006546115009163ffffffff6112ca16565b6005819055600060075560085461151c9163ffffffff6112ca16565b6008556005546115359062093a8063ffffffff61128816565b600d5561154b4262093a8063ffffffff6112ca16565b600a5560048054600654604080516340c10f1960e01b815230948101949094526024840191909152516001600160a01b03909116916340c10f1991604480830192600092919082900301818387803b1580156115a657600080fd5b505af11580156115ba573d6000803e3d6000fd5b505060055460408051918252516000805160206119938339815191529350908190036020019150a16115f5565b600b805460ff191660011790555b42600e5550565b600081831061160b5781611228565b5090919050565b3390565b3361162081611930565b15611665576040805162461bcd60e51b815260206004820152601060248201526f1c1b1e8819985c9b48189e481a185b9960821b604482015290519081900360640190fd5b326001600160a01b038216146116b5576040805162461bcd60e51b815260206004820152601060248201526f1c1b1e8819985c9b48189e481a185b9960821b604482015290519081900360640190fd5b6001546116c8908363ffffffff6112ca16565b6001556001600160a01b0381166000908152600260205260409020546116f4908363ffffffff6112ca16565b6001600160a01b03808316600081815260026020908152604080832095909555815485516323b872dd60e01b8152600481019490945230602485015260448401889052945194909316936323b872dd936064808501949193918390030190829087803b15801561176357600080fd5b505af1158015611777573d6000803e3d6000fd5b505050506040513d602081101561178d57600080fd5b50505050565b6001600160a01b0381166117d85760405162461bcd60e51b815260040180806020018281038252602681526020018061196d6026913960400191505060405180910390fd5b6003546040516001600160a01b038084169216907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3600380546001600160a01b0319166001600160a01b0392909216919091179055565b600081848411156118c35760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611888578181015183820152602001611870565b50505050905090810190601f1680156118b55780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b6000818361191a5760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315611888578181015183820152602001611870565b50600083858161192657fe5b0495945050505050565b6000813f7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47081158015906119645750808214155b94935050505056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373de88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f774f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65724f6e6c792063616e2063616c6c206f6e636520746f207374617274207374616b696e67a265627a7a723158207c0bc63ebc4c66dd2aa5d49ce459422f8fc01932571681d8b80632b1e2d1c42464736f6c63430005110032"

contract = web3.eth.contract(address = address, abi = abi, bytecode = bytecode)
#con = contract.functions.rewardPerToken().call()
#print(con)
##transaction = contract.functions.notifyRewardAmount(rewardAmount).buildTransaction({'chainId': chainId, 'gas':80000, 'nonce': web3.eth.getTransactionCount(owner_address)})

periodFinish = contract.functions.periodFinish().call()
#blockinfo = web3.eth.getBlock('latest')
#print("blockinfo: ", blockinfo)
#last_block_timestamp = web3.eth.getBlock('latest').timestamp
#print("last_block_timestamp: ", last_block_timestamp)
dt = datetime.now(timezone.utc) 
now_utc = dt.timestamp() 
print("period_finish: ", periodFinish)
print("current system_time_utc: ", now_utc)

tdelta=(datetime.fromtimestamp(now_utc) - datetime.fromtimestamp(periodFinish))
#diff is negative as t2 is in the future compared to t2
seconds = tdelta.total_seconds()
print('difference is {0} seconds'.format(abs(tdelta.total_seconds())))

if (seconds < 60):
  print(now_utc, " is lower than ", periodFinish, "nothing to do")
else:
  #exit(1) #debugging
  print(now_utc, " is greater than ", periodFinish, " updating rewards")

  rewardAmount = 690000 * 1000000000000000000 #69000
  print("rewardAmount:", rewardAmount)
  transaction = contract.functions.addExtraReward(int(rewardAmount)).buildTransaction({'chainId': chainId, 'gas':200000, 'nonce': web3.eth.getTransactionCount(owner_address)})
  print(transaction)

  #commented for debug

  #signed_txn = web3.eth.account.signTransaction(transaction, owner_pc)
  #txn_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
  #print(txn_hash)