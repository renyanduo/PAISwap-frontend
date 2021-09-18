import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Skeleton } from 'antd';
import { formatEther } from '@ethersproject/units'
import { getStaking, getBalance, deposit, getTotalSupply, getPendingReward, getRedemption, getApy } from '../../util/pool/Pi';
import { getBalanceOf } from '../../util/pool/Pnft';
import CONFIG from '../../util/pool/config.json';
import { openNotificationWithIcon, toFixed, paiChainBlockToDay, toPercent } from '../../util/index';
import Button from '@/components/Button';
import ConnectWallet from '@/components/ConnectWallet';
import TransactionModal from '../TransactionModal';
import Modal from '@/components/Modal';
import HOT from '@/assets/images/hot.png';
import Max from '@/assets/images/max.png';
import PI from '@/assets/images/pi.jpg';
import './index.scss'

function Pi(props) {
    const { userAddress, piUsdt } = props;
    const [visible, setVisible] = useState(false)
    const [unVisible, setUnVisible] = useState(false)
    const [balance, setBalance] = useState('')
    const [staking, setStaking] = useState('')
    const [harvest, setHarvest] = useState('')
    const [totalStaking, setTotalStaking] = useState('')
    const [pendingReward, setPendingReward] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [unInputValue, setUnInputValue] = useState('')
    const [apyValve, setApyValve] = useState(null)
    const [confirmDisable, setConfirmDisable] = useState(true)
    const [unConfirmDisable, setUnConfirmDisable] = useState(true)
    const [transactionStatus, setTransactionStatus] = useState(null)
    const [showLoading, setShowLoading] = useState(false)

    useEffect(() => {
        notAddress()
    }, [])

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


    useEffect(() => {
        if (userAddress && piUsdt) {
            setTimeout(() => {
                getYield()
            }, 1000 * 5);
            const apyInterval = setInterval(() => {
                userAddress && getYield()
            }, (1000 * 60));
            return () => {
                clearInterval(apyInterval)
            }
        }
    }, [userAddress, piUsdt])

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

    const notAddress = () => {
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
    }

    const initialize = (address) => {
        getPendingReward(address).then(e => {
            setHarvest(e)
        }).catch(e => {
            console.log(e);
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

    const getYield = () => {
        getApy().then(async (e) => {
            let pnft_pi = Number(formatEther(e.reserves._reserve1)) / Number(formatEther(e.reserves._reserve0));
            let pi_pnft = Number(formatEther(e.reserves._reserve0)) / Number(formatEther(e.reserves._reserve1))
            let totalStaking = await getTotalSupply()
            // console.log('pnft_pi', pnft_pi);
            // console.log('pi_pnft', pi_pnft);
            // console.log(formatEther(e.reserves._reserve0));
            // console.log(formatEther(e.reserves._reserve1));
            // console.log(e.token0);
            // console.log(e.token1);
            // console.log(Number(totalStaking));
            // console.log('共质押',totalStaking, '一天有多少块', paiChainBlockToDay, '每个块的收益(pnft)',e.totalReward);
            // console.log('每日总块收益（pnft）:', ((paiChainBlockToDay * (Number(e.totalReward)) * pnft_pi) * Number(piUsdt)) + '$');
            // console.log('共质押*币种价格:', (Number(totalStaking) * Number(piUsdt)) + '$');
            let apy = toPercent((((paiChainBlockToDay * (Number(e.totalReward)) * pnft_pi) * Number(piUsdt)) / (Number(totalStaking) * Number(piUsdt))) * 365)
            setApyValve(apy)
            console.log();
        }).catch(e => {
            console.log(e);
        });
    }
    const confirm = () => {
        deposit(inputValue).then(e => {
            console.log(e);
            openNotificationWithIcon('info', 'Submitted on the chain, please wait for confirmation on the chain.')
            e.wait().then(w => {
                openNotificationWithIcon('success', 'Successful transaction!')
                userAddress && initialize(userAddress)
            }).catch(e => {
                openNotificationWithIcon('error', 'transaction failed!')
            })
        }).catch(e => {
            console.log(e)
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
        console.log('maxClick');
        inputValueChange(balance)
    }
    const unMaxClick = () => {
        unInputValueChange(staking)
    }
    return (
        <>
            <TransactionModal visible={showLoading} status={transactionStatus} onTclose={closeTranModal} />
            <Modal
                className="modal"
                visible={visible}
                title="Stake PI tokens"
                confirm={confirm}
                onClose={closeModal}
                confirmDisable={confirmDisable}
                target={<Link to="/swap">Get PI</Link>}
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
                            PI
                        </span>

                    </div>
                </>
            </Modal>

            <Modal
                className="modal"
                visible={unVisible}
                title="Unstake PI tokens"
                confirm={unConfirm}
                onClose={unCloseModal}
                confirmDisable={unConfirmDisable}
            >
                <>
                    <div className="title-warp">
                        <span>Unstake: </span>
                        <span>Balance: {toFixed(staking)}</span>
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
                            ETH-USDT LP
                        </span>

                    </div>
                </>
            </Modal>
            <div className="card_item">
                <img className="hot_icon" src={HOT} alt="hot" />
                <div className="item_warp">
                    <div className="warp_info">
                        <img className="coin_logo" src={PI} alt="PI" />
                        <div className="info_coin">
                            <span>PI</span>
                            <span>APY: {apyValve ? apyValve : '--'}</span>
                        </div>
                    </div>
                    {userAddress ? (
                        <>
                            <div className="warp_text">
                                <div className="text_item">
                                    <div>Can dig up:</div>
                                    {pendingReward !== '' ? <div title={pendingReward}>{toFixed(pendingReward)}</div> : <Skeleton.Button style={{ height: 14 }} active size="small" />}
                                </div>
                                <div className="text_item">
                                    <div>
                                        <span className="">5.9 Double </span>
                                        Earn:
                                    </div>
                                    <span>PNFT</span>
                                </div>
                                <div className="text_item">
                                    <div>Total Liquidity:</div>
                                    {totalStaking !== '' ? <div title={totalStaking}>{toFixed(totalStaking)}</div> : <Skeleton.Button style={{ height: 14 }} active size="small" />}
                                </div>
                            </div>
                            <div className="warp_mapi">
                                <span>PNFT EARNED:</span>
                            </div>
                            <div className="warp_input">
                                {harvest !== '' ? <span title={harvest} >{toFixed(harvest)}</span> : <Skeleton.Button style={{ width: '100%' }} active size="small" />}
                                <div className={staking > 0 ? "showBtn" : "btn"} onClick={() => staking > 0 && redemption(staking)}>Harvest</div>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="warp_mapi">
                                <span>PNFT EARNED:</span>
                            </div>
                            <div className="warp_input">
                                <span>{toFixed(harvest)}</span>
                                <div className="btn" disabled>Harvest</div>
                            </div>
                            <div className="warp_text">
                                <div className="text_item">
                                    <div>Can dig up:</div>
                                    {pendingReward !== '' ? <div title={pendingReward}>{toFixed(pendingReward)}</div> : <Skeleton.Button style={{ height: 14 }} active size="small" />}
                                </div>
                                <div className="text_item">
                                    <div>
                                        <span className="">5.9 Double </span>
                                        Earn:
                                    </div>
                                    <span>PNFT</span>
                                </div>
                                <div className="text_item">
                                    <div>Total Liquidity:</div>
                                    {totalStaking !== '' ? <div title={totalStaking}>{toFixed(totalStaking)}</div> : <Skeleton.Button style={{ height: 14 }} active size="small" />}
                                </div>
                            </div>
                        </>
                    )}



                    <div className="warp_desc">
                        <span> PI </span>
                        STAKED
                    </div>
                    {userAddress ? (
                        <div className="warp_option">
                            {staking !== '' ? <span className="option_number" title={staking}>{toFixed(staking)}</span> : <Skeleton.Button style={{ width: '100%' }} active size="small" />}
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

Pi.propTypes = {
    userAddress: PropTypes.string.isRequired,
    piUsdt: PropTypes.string.isRequired
}

export default Pi