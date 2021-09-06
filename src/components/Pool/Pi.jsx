import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getStaking, getBalance, deposit, getTotalSupply } from '../../util/pool';
import { openNotificationWithIcon } from '../../util/index';
import Button from '@/components/Button';
import ConnectWallet from '@/components/ConnectWallet';
import Modal from '@/components/Modal';
import HOT from '@/assets/images/hot.png';
import Max from '@/assets/images/max.png';
import './index.scss'

function Pi(props) {
    const { userAddress } = props;
    const [visible, setVisible] = useState(false)
    const [balance, setBalance] = useState(0)
    const [staking, setStaking] = useState(0)
    const [totalStaking, setTotalStaking] = useState(0)
    const [inputValue, setInputValue] = useState('')
    const [confirmDisable, setConfirmDisable] = useState(false)

    useEffect(() => {
        initialize()
        return () => {
        }
    }, [])

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

    const closeModal = () => {
        setVisible(false)
        console.log('我是onClose回调')
    }
    const initialize = () => {
        getStaking(userAddress).then(e => {
            setStaking(Number(e))
        }).catch(e => {
            console.log(e);
            setStaking(0)
        });
        getTotalSupply().then(e => {
            setTotalStaking(Number(e))
        }).catch(e => {
            console.log(e);
            setTotalStaking(0)
        });
    }
    const confirm = () => {
        deposit(userAddress, inputValue).then(e => {
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

    const maxClick = () => {
        setInputValue(balance)
    }
    return (
        <>
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
                visible={visible}
                title="Unstake PI tokens"
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
                                    <div>312,312,411</div>
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
                                <span>0</span>
                                {
                                    staking > 0 ? (
                                        <div className="showBtn" onClick={showModal}>Harvest</div>
                                    ) : (
                                        <div className="btn">Harvest</div>
                                    )
                                }

                            </div>

                        </>
                    ) : (
                        <>
                            <div className="warp_mapi">
                                <span>MAPI EARNED:</span>
                            </div>
                            <div className="warp_input">
                                <span>1.999</span>
                                <div className="btn" disabled="true">Harvest</div>
                            </div>
                            <div className="warp_text">
                                <div className="text_item">
                                    <div>Can dig up:</div>
                                    <div>312,312,411</div>
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
                                    <div className="add" onClick={showModal}>+</div>
                                    <div className="sub" onClick={showModal}>-</div>
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