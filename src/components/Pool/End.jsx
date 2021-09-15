import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getStaking, getBalance, deposit, getTotalSupply, getPendingReward, getRedemption, getApy } from '../../util/pool/Pi';
import { getBalanceOf } from '../../util/pool/Pnft';
import CONFIG from '../../util/pool/config.json';
import { openNotificationWithIcon, toFixed, paiChainBlockToDay } from '../../util/index';
import Button from '@/components/Button';
import ConnectWallet from '@/components/ConnectWallet';
import TransactionModal from '../TransactionModal';
import PI from '@/assets/images/pi.jpg';
import './end.scss'

function End(props) {
    const { userAddress } = props;
    const [balance, setBalance] = useState("0")
    const [staking, setStaking] = useState("0")
    const [harvest, setHarvest] = useState(0)
    const [totalStaking, setTotalStaking] = useState(0)
    const [pendingReward, setPendingReward] = useState(0)
    const [inputValue, setInputValue] = useState('')
    const [unInputValue, setUnInputValue] = useState('')
    const [confirmDisable, setConfirmDisable] = useState(true)
    const [unConfirmDisable, setUnConfirmDisable] = useState(true)
    const [transactionStatus, setTransactionStatus] = useState(null)
    const [showLoading, setShowLoading] = useState(false)

    useEffect(() => {
        userAddress && initialize(userAddress)
        let initializeInterval = setInterval(() => {
            userAddress && initialize(userAddress)
        }, 1000 * 10);
        return () => {
            clearInterval(initializeInterval)
            initializeInterval = null
        }
    }, [userAddress])


    const initialize = (address) => {
        getPendingReward(address).then(e => {
            setHarvest(e)
        }).catch(e => {
            console.log(e);
        });
        getTotalSupply().then(e => {
            setTotalStaking(Number(e))
        }).catch(e => {
            console.log(e);
            setTotalStaking(0)
        });
        getBalanceOf(CONFIG['piContractAddress']).then(e => {
            setPendingReward(Number(e))
        }).catch(e => {
            console.log(e);
            setPendingReward(0)
        });

        getStaking(address).then(e => {
            setStaking(e)
        }).catch(e => {
            console.log(e);
            setStaking('0')
        });
        getBalance(address).then(e => {
            setBalance(e)
        }).catch(e => {
            setBalance('0')
            console.log(e);
        })
    }

    const redemption = (amount) => {
        setShowLoading(true)
        getRedemption(amount).then(res => {
            setTransactionStatus('success')
            res.wait().then(w => {
                openNotificationWithIcon('success', 'Successful transaction!')
                userAddress && initialize(userAddress)
            }).catch(e => {
                openNotificationWithIcon('error', 'transaction failed!')
            })
        }).catch(e => {
            setTransactionStatus('fail')
            console.log(e);
        })
    }
    const closeTranModal = () => {
        setShowLoading(false)
        setTransactionStatus(null)
    }
    return (
        <>
            <TransactionModal visible={showLoading} status={transactionStatus} onTclose={closeTranModal} />
            <div className="card_item">
                <div className="item_warp">
                    <div className="warp_info">
                        <img className="coin_logo" src={PI} alt="PI" />
                        <div className="info_coin">
                            <span>PI</span>
                            <span>第一期</span>
                        </div>
                    </div>
                    <div className="warp_descs">
                        <span className={staking > 0 ? "warp_mapi_time" : "warp_mapi_time disable"}>2021.06.07 21:00:00 Ended</span>
                        <span className="warp_mapi">PNFT EARNED:</span>
                        <span className="warp_mapi_value">1999</span>
                        <div className="warp_mapi">
                            <span> PI </span>
                            STAKED
                        </div>
                        <span className="warp_mapi_value">{toFixed(harvest)}</span>
                    </div>
                    
                    {userAddress ? (
                        <div className="warp_input">
                            <div className={staking > 0 ? "harvestBtn" : "disBtn"} onClick={() => staking > 0 && redemption(staking)}>Harvest</div>
                        </div>
                    ) : (
                        <ConnectWallet>
                            <Button className="button" style={{ margin: '0 auto' }}> Unlock Wallet </Button>
                        </ConnectWallet>
                    )}
                </div>
            </div>
        </>
    )
}

End.propTypes = {
    userAddress: PropTypes.string.isRequired
}

export default End