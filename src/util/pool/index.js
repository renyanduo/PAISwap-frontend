import { Contract } from '@ethersproject/contracts'
import { Web3Provider, getDefaultProvider } from '@ethersproject/providers'
import { formatEther, parseEther } from '@ethersproject/units'
import STAKING_ABI from './PiStakingEpoch.json'
import CONFIG from './config.json';
const provider = new Web3Provider(window.web3.currentProvider)
const STAKING = new Contract(CONFIG["STAKING-ERC20"], STAKING_ABI.abi, provider.getSigner());

// 钱包余额
export function getBalance (userAddress) {
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
 * @param {msg.value} 质押PI的数量，PI的精度为18，数值按照精度换算好 
 * @returns 
 */
 export function deposit(address, value) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await STAKING.deposit({ value: parseEther(value)})
            resolve(list)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 查询制定用户地址上质押的PI数量
 * @param {_user} 用户地址 
 * @returns {amount} 质押的PI的数量，带有精度的数值
 */
export function getStaking(_user) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await STAKING.getStaking(_user);
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 获取全网质押PI的总数量
 * @returns {amount} 全网质押PI的总数，根据精度换算之后的数值
 */
export function getTotalSupply() {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await STAKING.getTotalSupply();
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