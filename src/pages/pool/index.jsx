import React, { useState, useEffect } from 'react'
import { message } from 'antd'

import { Row, Col } from 'antd'
import { useSelector } from 'react-redux'
import Switch from "@/components/Switch";
import Pi from '../../components/Pool/Pi';
import PropTypes from 'prop-types';

import './index.scss'

function Pool(props) {
    const userAddress = useSelector(state => state.address)
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!isMetaMaskInstalled()) {
            message.error('need to install metamask')
            return
        }
        return () => {
            // cleanup
        }
    }, [userAddress])

    const isMetaMaskInstalled = () => {
        //Have to check the ethereum binding on the window object to see if it's installed
        const { ethereum } = window
        return Boolean(ethereum && ethereum.isMetaMask)
    }
    useEffect(() => {
        if (!window.ethereum.chainId === 0x999d4b) {
            switchPlianChain(true)
        }

        return () => {
        }
    }, [window.ethereum.chainId])




    const switchPlianChain = async type => {
        const { ethereum } = window
        try {
            const flag = await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [type && {
                    chainId: '0x999d4b',
                    chainName: 'Plian-subchain1test',
                    rpcUrls: ['https://testnet.plian.io/child_test'],
                    blockExplorerUrls: ['https://testnet.plian.org/child_test'],
                    nativeCurrency: {
                        symbol: 'PI',
                        decimals: 18
                    }
                }]
            })
            return flag
        } catch (switchError) {
            console.log(switchError)
        }
    }


    return (
        <div className="main">
            
            <div className="pool-content">
                <div className="switch">
                    <Switch
                        checked={isChecked}
                        onChange={(checked) => {
                            setIsChecked(checked);
                        }}
                    />
                    <span>Staked only</span>
                </div>
                <Row gutter={[16, 16]} className="cards">
                    {/* <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <div className="card_item">
                            <img className="hot_icon" src={HOT} alt="hot" />
                            <div className="item_warp">
                                <div className="warp_info">
                                    <img src={HOT} alt="coin" />
                                    <div className="info_coin">
                                        <span>ETH/USDT LP</span>
                                        <span>APY: 597.99%</span>
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
                                                <span>MAPI</span>
                                            </div>
                                            <div className="text_item">
                                                <div>Total Liquidity:</div>
                                                <div>$ 621,312,312</div>
                                            </div>
                                        </div>
                                        <div className="warp_mapi">
                                            <span>MAPI EARNED:</span>
                                        </div>
                                        <div className="warp_input">
                                            <span>1.999</span>
                                            {
                                                1 < 0 ? (
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
                                                <span>MAPI</span>
                                            </div>
                                            <div className="text_item">
                                                <div>Total Liquidity:</div>
                                                <div>$ 621,312,312</div>
                                            </div>
                                        </div>
                                    </>
                                )}



                                <div className="warp_desc">
                                    <span>ETH-USDT LP </span>
                                    STAKED
                                </div>
                                {userAddress ? (
                                    <div className="warp_option">
                                        <span className="option_number">1.999</span>
                                        {1 < 0 ? (
                                            <div className="option_btns">
                                                <div className="add">+</div>
                                                <div className="sub">-</div>
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
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <div className="card_item">
                            <img className="hot_icon" src={HOT} alt="hot" />
                            <div className="item_warp">
                                <div className="warp_info">
                                    <img src={HOT} alt="coin" />
                                    <div className="info_coin">
                                        <span>ETH/USDT LP</span>
                                        <span>APY: 597.99%</span>
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
                                                <span>MAPI</span>
                                            </div>
                                            <div className="text_item">
                                                <div>Total Liquidity:</div>
                                                <div>$ 621,312,312</div>
                                            </div>
                                        </div>
                                        <div className="warp_mapi">
                                            <span>MAPI EARNED:</span>
                                        </div>
                                        <div className="warp_input">
                                            <span>1.999</span>
                                            {
                                                1 < 0 ? (
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
                                                <span>MAPI</span>
                                            </div>
                                            <div className="text_item">
                                                <div>Total Liquidity:</div>
                                                <div>$ 621,312,312</div>
                                            </div>
                                        </div>
                                    </>
                                )}



                                <div className="warp_desc">
                                    <span>ETH-USDT LP </span>
                                    STAKED
                                </div>
                                {userAddress ? (
                                    <div className="warp_option">
                                        <span className="option_number">1.999</span>
                                        {1 < 0 ? (
                                            <div className="option_btns">
                                                <div className="add">+</div>
                                                <div className="sub">-</div>
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
                    </Col> */}
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Pi userAddress={userAddress} />
                    </Col>
                </Row>
            </div>
        </div >
    )
}

Pool.propTypes = {

}

export default Pool

