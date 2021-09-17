import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { formatEther } from '@ethersproject/units'
import { getStaking, getBalance, deposit, Approve, getAllowance, getTotalSupply, getPendingReward, getRedemption, getApy } from '../../util/pool/Lp';
import { getBalanceOf } from '../../util/pool/Pnft';
import CONFIG from '../../util/pool/config.json';

import { openNotificationWithIcon, toFixed, paiChainBlockToDay } from '../../util/index';
import Button from '@/components/Button';
import ConnectWallet from '@/components/ConnectWallet';
import TransactionModal from '../TransactionModal';
import Modal from '@/components/Modal';
import HOT from '@/assets/images/hot.png';
import Max from '@/assets/images/max.png';
import PNFT from '@/assets/images/pnft.jpg';
import PI from '@/assets/images/pi.jpg';

import './index.scss'

function Lp(props) {
    const { userAddress } = props
    const piUsdt = useSelector(state => state.piUsdt)
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

    // useEffect(() => {
    //     if (userAddress && piUsdt) {
    //          setTimeout(() => {
    //             getYield()
    //         }, 1000 * 5);
    //         const apyInterval = setInterval(() => {
    //             userAddress && getYield()
    //         }, (1000 * 60) * 5);
    //         return () => {
    //             clearInterval(apyInterval)
    //         }
    //     }
    // }, [userAddress, piUsdt])

    const inputValueChange = (value) => {
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

    const unInputValueChange = (value) => {
        setUnInputValue(value)
        if (Number(value) > 0 && Number(value) <= Number(staking)) {
            setUnConfirmDisable(false)
        } else {
            setUnConfirmDisable(true)
        }
    }

    const onApprove = () => {
        Approve(userAddress).then(v => {
            openNotificationWithIcon('success', 'Approve succeeded!')
            userAddress && initialize(userAddress)
        }).catch(e => {
            console.log(e);
        }).finally(setVisible(false))
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

    const getYield = () => {
        getApy().then(async (e) => {
            let pnft_pi = Number(formatEther(e.reserves._reserve1)) / Number(formatEther(e.reserves._reserve0));
            let pi_pnft = Number(formatEther(e.reserves._reserve0)) / Number(formatEther(e.reserves._reserve1))
            let totalStaking = await getTotalSupply()
            console.log('pnft_pi', pnft_pi);
            console.log('pi_pnft', pi_pnft);
            console.log(formatEther(e.reserves._reserve0));
            console.log(formatEther(e.reserves._reserve1));
            console.log(e.token0);
            console.log(e.token1);
            console.log(Number(totalStaking));
            console.log('共质押', totalStaking, '一天有多少块', paiChainBlockToDay, '每个块的收益(pnft)', e.totalReward, '待挖取总量', pendingReward);

            console.log('每日总块收益（pnft）:', ((paiChainBlockToDay * (Number(e.totalReward)) * pnft_pi) * Number(piUsdt)) + '$');
            console.log('共质押*币种价格:', (Number(totalStaking) * Number(piUsdt)) + '$');
            // https://data.gateapi.io/api2/1/ticker/pi_usdt
            console.log((((paiChainBlockToDay * (Number(e.totalReward)) * pnft_pi) * Number(piUsdt)) / (Number(totalStaking) * Number(piUsdt))) * 1);
        }).catch(e => {
            console.log(e);
        });
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
        }).catch(e => {
            setBalance('0')
            console.log(e);
        })
        getPendingReward(address).then(e => {
            setHarvest(e)
        }).catch(e => {
            console.log(e);
        });
        getBalanceOf(CONFIG['lpContractAddress']).then(e => {
            setPendingReward(e)
        }).catch(e => {
            console.log('Error', e);
            console.log(e);
            setPendingReward(0)
        });
        getTotalSupply().then(e => {
            setTotalStaking(Number(e))
        }).catch(e => {
            console.log(e);
            setTotalStaking(0)
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
                target={<Link to="/swap">Get PNFT-PI LP</Link>}
                approve={Boolean(allowance <= 0)}
                onApprove={onApprove}
            >
                <>
                    <div className="title-warp">
                        <span>Stake: </span>
                        <span>Balance: {toFixed(balance)}</span>
                    </div>
                    <div className="content-warp">
                        <div className="input-warp">
                            <img src={Max} className="warp-icon" alt="max" onClick={maxClick} />
                            <input
                                type="number"
                                onChange={e => inputValueChange(e.target.value)}
                                value={inputValue}
                                placeholder="0.0"
                            />
                        </div>
                        <span className="warp-desc">
                            PNFT-PI LP
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
                                onChange={e => unInputValueChange(e.target.value)}
                                value={unInputValue}
                                placeholder="0.0"
                            />
                        </div>
                        <span className="warp-desc">
                            PNFT-PI LP
                        </span>

                    </div>
                </>
            </Modal>
            <div className="card_item">
                <img className="hot_icon" src={HOT} alt="hot" />
                <div className="item_warp">
                    <div className="warp_info">
                        <div className="coin_imgs">
                            <img src={PNFT} alt="PNFT" />
                            <img src={PI} alt="PI" />
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
                                    <span>MAPI</span>
                                </div>
                                <div className="text_item">
                                    <div>Total Liquidity:</div>
                                    <div>{toFixed(totalStaking)}</div>
                                </div>
                            </div>
                            <div className="warp_mapi">
                                <span>MAPI EARNED:</span>
                            </div>
                            <div className="warp_input">
                                <span>{toFixed(harvest)}</span>
                                <div className={staking > 0 ? "showBtn" : "btn"} onClick={() => staking > 0 && redemption(staking)}>Harvest</div>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="warp_mapi">
                                <span>MAPI EARNED:</span>
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
    userAddress: PropTypes.string.isRequired
}

export default Lp