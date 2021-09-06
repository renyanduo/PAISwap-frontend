import { Contract } from '@ethersproject/contracts'
import { Web3Provider, getDefaultProvider } from '@ethersproject/providers'
import { formatEther, parseEther } from '@ethersproject/units'
import PI_ABI from './PiStakingEpoch.json'
import PNFT_ABI from './PnftStaking.json'
import CONFIG from './config.json';
const PI_STAKING = new Contract(CONFIG["piContractAddress"], PI_ABI.abi, new Web3Provider(window.web3.currentProvider).getSigner());

const PNFT_STAKING = new Contract(CONFIG["pNftContractAddress"], PNFT_ABI, new Web3Provider(window.web3.currentProvider).getSigner());


/**
 * 查询用户参与的期数
 * @param {*} 用户地址 _user
 * @returns 
 */
export function getUserEpoch(_user) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await PI_STAKING.getUserEpoch(_user)
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 查询最新的期数
 * @param {*} 用户地址 _user
 * @returns 
 */
export function getCurrentEpoch() {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await PI_STAKING.getCurrentEpoch()
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 平台币余额
 * @param {userAddress} 用户地址 
 * @returns 
 */
export function getBalance(userAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            const { ethereum } = window
            const bal = await ethereum.request({
                method: 'eth_getBalance',
                params: [userAddress, 'latest']
            })
            resolve(formatEther(bal))
        } catch (error) {
            resolve(error)
        }
    })

}

/**
 * 质押PI
 * @param {*} 质押PI的数量，PI的精度为18，数值按照精度换算好 {value}
 * @returns 
 */
export function deposit(value) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(value);
            console.log(parseEther(value));
            const list = await PI_STAKING.deposit({ value: parseEther(value) })
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 查询制定用户地址上质押的PI数量
 * @param {*} 用户地址 _user
 * @returns {*} 质押的PI的数量，带有精度的数值 amount
 */
export function getStaking(_user) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await PI_STAKING.getStaking(_user);
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 获取全网质押PI的总数量
 * @returns {*} 全网质押PI的总数，根据精度换算之后的数值 amount
 */
export function getTotalSupply() {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await PI_STAKING.getTotalSupply();
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 获取全网质押PI的总数量
 * @param {_user} 查询用户地址上待领取的PNFT的数量
 * @returns {amount} 用户质押挖矿未领取的PNFT数量，根据精度换算之后的数值 
 */
export function getPendingReward(_user) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await PI_STAKING.pendingReward(_user);
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
            const list = await PI_STAKING.withdraw(parseEther(_amount.toString()));
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 待挖取PNFT的数量
 * @returns {amount} 待挖取PNFT的数量
 */
export function getBalanceOf() {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await PNFT_STAKING.balanceOf(PI_STAKING.address);
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}


export {
    formatEther,
    parseEther,
}