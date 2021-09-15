import React, { useState, useEffect, useRef, lazy } from 'react'
import axios from 'axios'
import { Row, Col, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { setPiUsdt } from '../../store/action'
// import Switch from "@/components/Switch";
import TabsControl from "@/components/TabsControl";

import { TESTNET_CHILD } from '@/util/config'
import './index.scss';

const Pi = lazy(() => import(/* webpackChunkName: "Pool" */ '@/components/Pool/Pi'))
const Lp = lazy(() => import(/* webpackChunkName: "Pool" */ '@/components/Pool/Lp'))
const End = lazy(() => import(/* webpackChunkName: "Pool" */ '@/components/Pool/End'))


function Pool(props) {
    const dispatch = useDispatch()
    const userAddress = useSelector(state => state.address)
    const piUsdt = useSelector(state => state.piUsdt)
    // const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        const source = axios.CancelToken.source()
        console.log(source);
        getPiUsdtPrice(source)
        return () => {
            source.cancel('取消请求')
        }
    }, [])
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

    const getPiUsdtPrice = (source) => {
        axios.get('https://data.gateapi.io/api2/1/ticker/pi_usdt', { cancelToken: source.token }).then(res => {
            let data = res.data
            if (data) {
                dispatch(setPiUsdt({ piUsdt: data.last }))
            }
        }).catch(e => {
            console.log(e);
        })
    }

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
                params: [type && TESTNET_CHILD]
            })
            return flag
        } catch (switchError) {
            console.log(switchError)
        }
    }


    return (
        <div className="main">

            <div className="pool-content">
                {/* <div className="switch">
                    <Switch
                        checked={isChecked}
                        onChange={(checked) => {
                            setIsChecked(checked);
                        }}
                    />
                    <span>Staked only</span>
                </div> */}
                {/* {isChecked ? undefined : 
                    (*/}
                <TabsControl>
                    <Row gutter={[16, 22]} className="cards" name="ONGOING">
                        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                            <Lp userAddress={userAddress} />
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                            <Pi piUsdt={piUsdt} userAddress={userAddress} />
                        </Col>
                    </Row>
                    <Row gutter={[16, 22]} className="cards" name="ENDED">
                        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                            <End userAddress={userAddress} />
                        </Col>
                    </Row>
                </TabsControl>
            </div>
        </div>
    )
}

export default Pool

