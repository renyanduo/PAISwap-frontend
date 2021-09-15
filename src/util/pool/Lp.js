import { Contract } from '@ethersproject/contracts'
import { Web3Provider, getDefaultProvider } from '@ethersproject/providers'
import { formatEther, parseEther, formatUnits } from '@ethersproject/units'
import CONFIG from './config.json';
// import LP_ABI from './StakingWithEpoch.json'; //质押挖矿合约
import LP_ABI from './abis/MasterChef.json'; //质押挖矿合约
import UNI_ABI from './abis/UniswapV2Pair.json'; //质押输入

const LP_STAKING = new Contract(CONFIG["lpContractAddress"], LP_ABI, getDefaultProvider(CONFIG["testNetWork"]));

const UNISWAP_STAKING = new Contract(CONFIG["uniswapContractAddress"], UNI_ABI.abi, getDefaultProvider(CONFIG["testNetWork"]));

/**
 * 余额
 * @param {userAddress} 用户地址 
 * @returns 
 */
export function getBalance(userAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await UNISWAP_STAKING.balanceOf(userAddress)
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 授权
 * @param {} 用户地址 
 * @returns 
 */
export function Approve() {
    return new Promise(async (resolve, reject) => {
        try {
            const UNISWAP_STAKING = new Contract(CONFIG["uniswapContractAddress"], UNI_ABI.abi, new Web3Provider(window.web3.currentProvider).getSigner());
            const list = await UNISWAP_STAKING.approve(CONFIG["lpContractAddress"], '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 查询账户授权额度
 * @returns {当前地址} userAddress
 */
export function getAllowance(userAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            const UNISWAP_STAKING = new Contract(CONFIG["uniswapContractAddress"], UNI_ABI.abi, new Web3Provider(window.web3.currentProvider).getSigner());
            const list = await UNISWAP_STAKING.allowance(userAddress, LP_STAKING.address)
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 质押PI
 * @param {*} 质押Lp的数量，LP的精度为18，数值按照精度换算好 {value}
 * @returns 
 */
export function deposit(value) {
    return new Promise(async (resolve, reject) => {
        try {
            const LP_STAKING = new Contract(CONFIG["lpContractAddress"], LP_ABI, new Web3Provider(window.web3.currentProvider).getSigner());
            const list = await LP_STAKING.deposit(0, parseEther(value))
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 查询制定用户地址上质押的LP数量
 * @param {*} 用户地址 _user
 * @returns {*} 质押的PI的数量，带有精度的数值 amount
 */
export function getStaking(_user) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await LP_STAKING.getStaking(0, _user);
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 获取全网质押LP的总数量
 * @returns {*} 全网质押LP的总数，根据精度换算之后的数值 amount
 */
export function getTotalSupply() {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await LP_STAKING.getTotalSupply(0);
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 查询用户地址上待领取的PNFT的数量
 * @param {_user} 用户地址
 * @returns {amount} 用户质押挖矿未领取的PNFT数量，根据精度换算之后的数值 
 */
export function getPendingReward(_user) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await LP_STAKING.pendingReward(0, _user);
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}


/**
 * 赎回质押的PI
 * @param {_amount} 待赎回的PI的数量，根据精度换算之后的数值
 * @returns {amount} 用户质押挖矿未领取的PNFT数量，根据精度换算之后的数值 
 */
export function getRedemption(_amount) {
    return new Promise(async (resolve, reject) => {
        try {
            const LP_STAKING = new Contract(CONFIG["lpContractAddress"], LP_ABI, new Web3Provider(window.web3.currentProvider).getSigner());
            const list = await LP_STAKING.withdraw(0, parseEther(_amount));
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 计算APY
 * @returns {*} _reserve0 _reserve1
 */
export function getApy() {
    return new Promise(async (resolve, reject) => {
        try {
            // 币种价格
            const reserves = await UNISWAP_STAKING.getReserves();
            // 币种0的合约地址
            const token0 = await UNISWAP_STAKING.token0();
            // 币种1的合约地址
            const token1 = await UNISWAP_STAKING.token1();
            // 每个块的奖励
            const totalReward = await LP_STAKING.rewardPerBlock();
            let list = {
                reserves,
                token0,
                token1,
                totalReward: formatEther(totalReward)
            }
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}