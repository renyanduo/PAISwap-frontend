import { Contract } from '@ethersproject/contracts'
import { getDefaultProvider } from '@ethersproject/providers'
import CONFIG from './config.json';
import { formatEther } from '@ethersproject/units'

import PNFT_ABI from './abis/PnftStaking.json'; //质押奖励

const PNFT_STAKING = new Contract(CONFIG["pNftContractAddress"], PNFT_ABI, getDefaultProvider(CONFIG["testNetWork"]));


/**
 * 待挖取 PNFT 的数量
 * @param {*} contractAddress 合约地址
 * @returns {amount} 待挖取PNFT的数量
 */
 export function getBalanceOf(contractAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await PNFT_STAKING.balanceOf(contractAddress);
            resolve(formatEther(list))
        } catch (error) {
            reject(error)
        }
    })
}