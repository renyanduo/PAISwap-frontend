import React, { useState, useEffect, lazy } from 'react'
import { message } from 'antd'

import { Row, Col } from 'antd'
import { useSelector } from 'react-redux'
import Switch from "@/components/Switch";
import PropTypes from 'prop-types';
import './index.scss';

const Pi = lazy(() => import(/* webpackChunkName: "Pool" */ '@/components/Pool/Pi'))
const Lp = lazy(() => import(/* webpackChunkName: "Pool" */ '@/components/Pool/Lp'))


function Pool(props) {
    const userAddress = useSelector(state => state.address)
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!isMetaMaskInstalled()) {
            console.log('need to install metamask');
            message.error('need to install metamask')
            return
        } else {
            const { chainId } = window.ethereum
            if (chainId !== 0x999d4b) {
                switchPlianChain(true)
            }
        }
        return () => {
            // cleanup
        }
    }, [])

    const isMetaMaskInstalled = () => {
        //Have to check the ethereum binding on the window object to see if it's installed
        const { ethereum } = window
        return Boolean(ethereum && ethereum.isMetaMask)
    }



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
                {isChecked ? undefined :
                    (
                        <Row gutter={[16, 22]} className="cards">
                            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                                <Lp userAddress={userAddress} />
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                                <Pi userAddress={userAddress} />
                            </Col>
                        </Row>
                    )
                }

            </div >
        </div >
    )
}

Pool.propTypes = {

}

export default Pool

