import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getStaking, getBalance, deposit, getTotalSupply, getBalanceOf, getPendingReward, getRedemption} from '../../util/pool';
import { openNotificationWithIcon } from '../../util/index';
import Button from '@/components/Button';
// import Loading from '@/components/loading';
import ConnectWallet from '@/components/ConnectWallet';
// import TransactionModal from '../../components/TransactionModal';
import Modal from '@/components/Modal';
import HOT from '@/assets/images/hot.png';
import Max from '@/assets/images/max.png';
import './index.scss'

function Pi(props) {
    const { userAddress } = props;
    const [visible, setVisible] = useState(false)
    // const [showLoading, setShowLoading] = useState(false)
    const [unVisible, setUnVisible] = useState(false)
    const [balance, setBalance] = useState(0)
    const [staking, setStaking] = useState(0)
    const [harvest, setHarvest] = useState(0)
    const [totalStaking, setTotalStaking] = useState(0)
    const [pendingReward, setPendingReward] = useState(0)
    const [inputValue, setInputValue] = useState('')
    const [unInputValue, setUnInputValue] = useState('')
    const [confirmDisable, setConfirmDisable] = useState(false)
    const [unConfirmDisable, setUnConfirmDisable] = useState(false)

    useEffect(() => {
        userAddress && initialize(userAddress)
        return () => {
        }
    }, [userAddress])

    useEffect(() => {
        if (inputValue > 0 && inputValue <= balance) {
            setConfirmDisable(false)
        } else {
            setConfirmDisable(true)
        }
        return () => {
        }
    }, [inputValue])

    useEffect(() => {
        if (unInputValue > 0 && unInputValue <= staking) {
            setUnConfirmDisable(false)
        } else {
            setUnConfirmDisable(true)
        }
        return () => {
        }
    }, [unInputValue])

    useEffect(() => {
        if (visible) {
            getBalance(userAddress).then(e => {
                setBalance(e)
            }).catch(e => {
                setBalance(0)
                console.log(e);
            })
        } else {
            setInputValue('')
        }
        return () => {
        }
    }, [visible])

    const showModal = () => {
        setVisible(true)
    }
    const showUnModal = () => {
        setUnVisible(true)
    }


    const closeModal = () => {
        setVisible(false)
        console.log('我是onClose回调')
    }
    const unCloseModal = () => {
        setUnVisible(false)
        console.log('我是onClose回调')
    }
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
        getBalanceOf().then(e => {
            setPendingReward(Number(e))
        }).catch(e => {
            console.log(e);
            setPendingReward(0)
        });

        getStaking(address).then(e => {
            setStaking(Number(e))
        }).catch(e => {
            console.log(e);
            setStaking(0)
        });
    }
    const confirm = () => {
        deposit(inputValue).then(e => {
            openNotificationWithIcon('info', '已提交上链，请等待链上确认。')
            e.wait().then(w => {
                openNotificationWithIcon('success', '成功', true)
                initialize()
                console.log(w);
            })
            console.log(e);
        }).catch(e => {
            console.log(e)
        })
        setVisible(false)
    }

    const unConfirm = async() => {
        await redemption(unInputValue);
        setUnVisible(false)
    }
    const redemption = (amount) => {
        // setShowLoading(true)
        getRedemption(amount).then(res => {
            openNotificationWithIcon('info', '已提交上链，请等待链上确认。')
            res.wait().then(w => {
                openNotificationWithIcon('success', '成功', true)
                initialize()
                console.log(w);
            })
        }).catch(e => {
            // setShowLoading(false)
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
            {/* <TransactionModal visible={showLoading} /> */}
            <Modal
                className="modal"
                visible={visible}
                title="Stake LP tokens"
                confirm={confirm}
                onClose={closeModal}
                confirmDisable={confirmDisable}
                target="http://www.baidu.com"
            >
                <>
                    <div className="title-warp">
                        <span>Unstake: </span>
                        <span>Balance: {balance}</span>
                    </div>
                    <div className="content-warp">
                        <div className="input-warp">
                            <img src={Max} className="warp-icon" alt="max" onClick={maxClick} />
                            <input
                                type="number"
                                onChange={e => setInputValue(e.target.value)}
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
                title="Unstake PI tokens"
                confirm={unConfirm}
                onClose={unCloseModal}
                confirmDisable={unConfirmDisable}
            >
                <>
                    <div className="title-warp">
                        <span>Unstake: </span>
                        <span>Balance: {staking}</span>
                    </div>
                    <div className="content-warp">
                        <div className="input-warp">
                            <img src={Max} className="warp-icon" alt="max" onClick={unMaxClick} />
                            <input
                                type="number"
                                onChange={e => setUnInputValue(e.target.value)}
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
                        <img src={HOT} alt="coin" />
                        <div className="info_coin">
                            <span>PI</span>
                            <span>APY: 00%</span>
                        </div>
                    </div>
                    {userAddress ? (
                        <>
                            <div className="warp_text">
                                <div className="text_item">
                                    <div>Can dig up:</div>
                                    <div>{pendingReward}</div>
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
                                    <div>$ {totalStaking}</div>
                                </div>
                            </div>
                            <div className="warp_mapi">
                                <span>MAPI EARNED:</span>
                            </div>
                            <div className="warp_input">
                                <span>{harvest}</span>
                                <div className={staking > 0 ? "showBtn" : "btn" } onClick={() => harvest > 0 && redemption(harvest)}>Harvest</div>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="warp_mapi">
                                <span>MAPI EARNED:</span>
                            </div>
                            <div className="warp_input">
                                <span>{harvest}</span>
                                <div className="btn" disabled>Harvest</div>
                            </div>
                            <div className="warp_text">
                                <div className="text_item">
                                    <div>Can dig up:</div>
                                    <div>{pendingReward}</div>
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
                                    <div>$ 621,312,312</div>
                                </div>
                            </div>
                        </>
                    )}



                    <div className="warp_desc">
                        <span> Pi </span>
                        STAKED
                    </div>
                    {userAddress ? (
                        <div className="warp_option">
                            <span className="option_number">{staking}</span>
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

}

export default Pi