import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { getStaking, getBalance, deposit, Approve, getAllowance, getTotalSupply, getBalanceOf, getPendingReward, getRedemption } from '../../util/pool/Lp';
import { openNotificationWithIcon, toFixed } from '../../util/index';
import Button from '@/components/Button';
import ConnectWallet from '@/components/ConnectWallet';
import TransactionModal from '../TransactionModal';
import Modal from '@/components/Modal';
import HOT from '@/assets/images/hot.png';
import Max from '@/assets/images/max.png';
import ETH from '@/assets/images/ethereum.png';
import USDT from '@/assets/images/usdt.png';

import './index.scss'

function Lp(props) {
    const { userAddress } = props;
    const [visible, setVisible] = useState(false)
    const [unVisible, setUnVisible] = useState(false)
    const [balance, setBalance] = useState('0')
    const [staking, setStaking] = useState('0')
    const [harvest, setHarvest] = useState(0)
    const [totalStaking, setTotalStaking] = useState(0)
    const [pendingReward, setPendingReward] = useState(0)
    const [allowance, setAllowance] = useState(0)
    const [inputValue, setInputValue] = useState('')
    const [unInputValue, setUnInputValue] = useState('')
    const [confirmDisable, setConfirmDisable] = useState(true)
    const [unConfirmDisable, setUnConfirmDisable] = useState(true)
    const [transactionStatus, setTransactionStatus] = useState(null)
    const [showLoading, setShowLoading] = useState(false)

    useEffect(() => {
        userAddress && initialize(userAddress)
        const initializeInterval = setInterval(() => {
            userAddress && initialize(userAddress)
        }, 1000 * 10);
        return () => {
            clearInterval(initializeInterval)
        }
    }, [userAddress])

    const inputValueChange = (e) => {
        let value = e.target.value;
        setInputValue(value);
        // console.log('Number(value) > 0', Number(value) > 0);
        // console.log('Number(value) <= Number(balance)', Number(value) <= Number(balance));
        // console.log(Number(value));
        // console.log(Number(balance));
        if (Number(value) > 0 && Number(value) <= Number(balance)) {
            setConfirmDisable(false)
        } else {
            setConfirmDisable(true)
        }
    }

    const unInputValueChange = useCallback(
        (e) => {
            setUnInputValue(e.target.value)
            if (Number(e.target.value) > 0 && Number(e.target.value) <= Number(staking)) {
                setUnConfirmDisable(false)
            } else {
                console.log(true);
                setUnConfirmDisable(true)
            }
        },
        [unInputValue],
    )

    const onApprove = () => {
        Approve(userAddress).then(v => {
            openNotificationWithIcon('success', 'Approve succeeded!')
            userAddress && initialize(userAddress)
        }).catch(e => {
            console.log(e);
        }).finally (setVisible(false))
    }

    const showModal = () => {
        setVisible(true)
    }
    const showUnModal = () => {
        setUnVisible(true)
    }


    const closeModal = () => {
        setVisible(false)
        setInputValue('')
        setConfirmDisable(true)
        console.log('我是onClose回调')
    }
    const unCloseModal = () => {
        setUnVisible(false)
        setUnInputValue('')
        setUnConfirmDisable(true)
        console.log('我是onClose回调')
    }
    const closeTranModal = () => {
        setShowLoading(false)
        setTransactionStatus(null)
    }

    const initialize = (address) => {
        getAllowance(userAddress).then(e => {
            setAllowance(Number(e))
        }).catch(e => {
            setAllowance(0)
            console.log(e);
        })

        getBalance(address).then(e => {
            setBalance(e)
            console.log(balance);
        }).catch(e => {
            setBalance('0')
            console.log(e);
        })
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
        getBalanceOf().then(e => {
            setPendingReward(e)
        }).catch(e => {
            console.log('Error', e);
            console.log(e);
            setPendingReward(0)
        });

        getStaking(address).then(e => {
            setStaking(e)
        }).catch(e => {
            console.log(e);
            setStaking('0')
        });
    }
    const confirm = () => {
        console.log(inputValue);
        deposit(inputValue).then(e => {
            openNotificationWithIcon('info', 'Submitted on the chain, please wait for confirmation on the chain.')
            e.wait().then(w => {
                openNotificationWithIcon('success', 'Successful transaction!')
                userAddress && initialize(userAddress)
            }).catch(e => {
                openNotificationWithIcon('error', 'transaction failed!')
            })
        }).catch(e => {
            const { message } = e;
            openNotificationWithIcon('error', message)
        })
        setVisible(false)
    }

    const unConfirm = async () => {
        await redemption(unInputValue);
        setUnVisible(false)
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

    const maxClick = () => {
        setInputValue(balance)
    }
    const unMaxClick = () => {
        setUnInputValue(staking)
    }
    return (
        <>
            <TransactionModal visible={showLoading} status={transactionStatus} onTclose={closeTranModal} />
            <Modal
                className="modal"
                visible={visible}
                title="Stake LP tokens"
                confirm={confirm}
                onClose={closeModal}
                confirmDisable={confirmDisable}
                target="http://www.baidu.com"
                approve={Boolean(allowance <= 0)}
                onApprove={onApprove}
            >
                <>
                    <div className="title-warp">
                        <span>Unstake: </span>
                        <span>Balance: {toFixed(balance)}</span>
                    </div>
                    <div className="content-warp">
                        <div className="input-warp">
                            <img src={Max} className="warp-icon" alt="max" onClick={maxClick} />
                            <input
                                type="number"
                                onChange={e => inputValueChange(e)}
                                value={inputValue}
                                placeholder="0.0"
                            />
                        </div>
                        <span className="warp-desc">
                            ETH-USDT LP
                        </span>

                    </div>
                </>
            </Modal>

            <Modal
                className="modal"
                visible={unVisible}
                title="Unstake LP tokens"
                confirm={unConfirm}
                onClose={unCloseModal}
                confirmDisable={unConfirmDisable}
            >
                <>
                    <div className="title-warp">
                        <span>Unstake: </span>
                        <span>Balance: {staking ? toFixed(staking) : '-'}</span>
                    </div>
                    <div className="content-warp">
                        <div className="input-warp">
                            <img src={Max} className="warp-icon" alt="max" onClick={unMaxClick} />
                            <input
                                type="number"
                                onChange={e => unInputValueChange(e)}
                                value={unInputValue}
                                placeholder="0.0"
                            />
                        </div>
                        <span className="warp-desc">
                            ETH-USDT LP
                        </span>

                    </div>
                </>
            </Modal>
            <div className="card_item">
                <img className="hot_icon" src={HOT} alt="hot" />
                <div className="item_warp">
                    <div className="warp_info">
                        <div className="coin_imgs">
                            <img src={ETH} alt="ethereum" />
                            <img src={USDT} alt="usdt" />
                        </div>
                        <div className="info_coin">
                            <span>PNFT/PI LP</span>
                            <span>APY: --</span>
                        </div>
                    </div>
                    {userAddress ? (
                        <>
                            <div className="warp_text">
                                <div className="text_item">
                                    <div>Can dig up:</div>
                                    <div>{toFixed(pendingReward)}</div>
                                </div>
                                <div className="text_item">
                                    <div>
                                        <span className="">5.9 Double </span>
                                        Earn:
                                    </div>
                                    <span>PI</span>
                                </div>
                                <div className="text_item">
                                    <div>Total Liquidity:</div>
                                    <div>{toFixed(totalStaking)}</div>
                                </div>
                            </div>
                            <div className="warp_mapi">
                                <span>PI EARNED:</span>
                            </div>
                            <div className="warp_input">
                                <span>{toFixed(harvest)}</span>
                                <div className={staking > 0 ? "showBtn" : "btn"} onClick={() => staking > 0 && redemption(staking)}>Harvest</div>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="warp_mapi">
                                <span>PI EARNED:</span>
                            </div>
                            <div className="warp_input">
                                <span>{toFixed(harvest)}</span>
                                <div className="btn" disabled>Harvest</div>
                            </div>
                            <div className="warp_text">
                                <div className="text_item">
                                    <div>Can dig up:</div>
                                    <div>{toFixed(pendingReward)}</div>
                                </div>
                                <div className="text_item">
                                    <div>
                                        <span className="">5.9 Double </span>
                                        Earn:
                                    </div>
                                    <span>PI</span>
                                </div>
                                <div className="text_item">
                                    <div>Total Liquidity:</div>
                                    <div>{toFixed(totalStaking)}</div>
                                </div>
                            </div>
                        </>
                    )}



                    <div className="warp_desc">
                        <span> PNFT-PI LP </span>
                        STAKED
                    </div>
                    {userAddress ? (
                        <div className="warp_option">
                            <span className="option_number">{toFixed(staking)}</span>
                            {staking > 0 ? (
                                <div className="option_btns">
                                    <div className="sub" onClick={showUnModal}>-</div>
                                    <div className="add" onClick={showModal}>+</div>
                                </div>

                            ) : (
                                <div className="showBtn" onClick={showModal}>Stake LP</div>
                            )}
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

Lp.propTypes = {

}

export default Lp