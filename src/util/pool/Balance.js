import { Contract } from '@ethersproject/contracts'
import { getDefaultProvider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import CONFIG from './config.json';

import BALANCE_ABI from './abis/BalanceOf.json'; //币种余额

const BALANCE_OF = new Contract(CONFIG["BalanceContractAddres"], BALANCE_ABI, getDefaultProvider(CONFIG["testNetWork"]));

/**
 * 余额
 * @param {*} IERC20 合约地址 
 * @param {*} userAddress 用户地址 
 * @returns 
 */
 export function getBalanceOf(IERC20, userAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await BALANCE_OF.getTokenBalanceOf(IERC20, userAddress)
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}
