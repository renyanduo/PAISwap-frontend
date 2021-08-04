export const ABI = [
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '_rewardToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_rewardPerBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_startBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_bonusEndBlock',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_adminAddress',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_wpi',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Deposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'EmergencyWithdraw',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Withdraw',
    type: 'event'
  },
  {
    inputs: [],
    name: 'WPI',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'adminAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'bonusEndBlock',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'pool',
    outputs: [
      {
        internalType: 'uint256',
        name: 'allocPoint',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'lastRewardBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'accCakePerShare',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'rewardPerBlock',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'rewardToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'startBlock',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'totalAllocPoint',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'userInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardDebt',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'inBlackList',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    stateMutability: 'payable',
    type: 'receive',
    payable: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_adminAddress',
        type: 'address'
      }
    ],
    name: 'setAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_blacklistAddress',
        type: 'address'
      }
    ],
    name: 'setBlackList',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wpi',
        type: 'address'
      }
    ],
    name: 'setWPI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_blacklistAddress',
        type: 'address'
      }
    ],
    name: 'removeBlackList',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '_reward',
        type: 'address'
      }
    ],
    name: 'setRewardToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_rewardCount',
        type: 'uint256'
      }
    ],
    name: 'setRewardPerBlock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_startBlock',
        type: 'uint256'
      }
    ],
    name: 'setStartBlockTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_endBlock',
        type: 'uint256'
      }
    ],
    name: 'setEndBlockTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_from',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_to',
        type: 'uint256'
      }
    ],
    name: 'getMultiplier',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address'
      }
    ],
    name: 'pendingReward',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_allcPoint',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_rewardBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_perShare',
        type: 'uint256'
      }
    ],
    name: 'updatePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'updatePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'emergencyRewardWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address'
      }
    ],
    name: 'getStaking',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'getTotalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  }
]

export const crossChainABI = [{
  "type": "function",
  "name": "DepositInMainChain",
  "constant": false,
  "inputs": [{
      "name": "chainId",
      "type": "string"
  }
  ],
  "outputs": []
},
  {
      "type": "function",
      "name": "DepositInChildChain",
      "constant": false,
      "inputs": [{
          "name": "chainId",
          "type": "string"
      },
          {
              "name": "txHash",
              "type": "bytes32"
          }
      ],
      "outputs": []
  },
  {
      "type": "function",
      "name": "WithdrawFromChildChain",
      "constant": false,
      "inputs": [{
          "name": "chainId",
          "type": "string"
      }
      ],
      "outputs": []
  },
  {
      "type": "function",
      "name": "WithdrawFromMainChain",
      "constant": false,
      "inputs": [{
          "name": "chainId",
          "type": "string"
      },
          {
              "name": "amount",
              "type": "uint256"
          },
          {
              "name": "txHash",
              "type": "bytes32"
          }
      ],
      "outputs": []
  }
]

export const PISTAKING_CONTRACT_ADDRESS = '0xbBeAB8d29458ac35Ac455669949A8907A2307787'

export const PNFT_CONTRACT_ADDRESS = '0xD046766524c66B0b2a53B2A0c92b18B9593C7951'

export const CROSS_CONTRACCT_ADDRESS = '0x0000000000000000000000000000000000000065'

export const gasl2 = 42000

export const gasPricel2 = 2000000000

export const gas = 3000000
 
export const gasPrice = 20000000000