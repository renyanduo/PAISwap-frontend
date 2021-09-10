import React, { useState, useEffect } from 'react';
import { Dropdown, Card, Skeleton } from 'antd'
import CONFIG from '../../util/pool/config.json'
import { getBalanceOf } from '../../util/pool/Balance'
import { toFixed } from '../../util'
import { getBalance } from '../../util/pool/Pi'

const PNFT  = require('../../assets/images/pnft.jpg');
const PI = require('../../assets/images/pi.jpg');

const coinList = [
    {
        icon: PI,
        name: 'PI',
        amount: 0,
        wait: getBalance,
    },
    {
        key: CONFIG["pNftContractAddress"],
        icon: PNFT,
        name: 'PNFT',
        amount: 0,
        wait: getBalanceOf,
    }
]

function WalletOption(props) {
    const { useAddress, children } = props
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])
    useEffect(() => {
        useAddress && initialize(useAddress)
        return () => {
            console.log('销毁');
        }
    }, [])

    const initialize = (address) => {
        setLoading(true)
        let list = []
        coinList.map(async (x) => {
            await list.push(getPromiseBalance(x, address))
        })

        Promise.all(list).then(res => {
            setList(res)
            setLoading(false)
        })
    }

    const getPromiseBalance = (x, address) => {
        return new Promise((resolve, riject) => {
            (x.key ? x.wait(x.key, address) : x.wait(address)).then(v => {
                console.log(x.icon);
                resolve({ name: x.name, icon: x.icon, amount: v })
            }).catch(e => {
                riject({ name: x.name, icon: x.icon, amount: 0 })
            })
        })
    }
    return (
        <Dropdown overlay={
            <Card style={{ backgroundColor: '#FFF', borderRadius: 16, width: 270, height: 215, overflowY: 'auto' }}>
                <Skeleton loading={loading} active>
                    <div style={{ padding: 10 }}>
                        {list && list.map(item => (
                            <div key={item.name} style={{display: 'flex', alignItems: 'center'}}>
                                <img src={item.icon.default} alt={item.name} style={{width: 25, height: 25}} />
                                <span style={{ flex: .3, paddingLeft: 10}}>{item.name}</span>
                                <span style={{ flex: 1, textAlign: 'end'}}>{toFixed(item.amount)}</span>
                            </div>
                        ))}
                    </div>
                </Skeleton>
            </Card>
        } placement="bottomRight" trigger={['click']} destroyPopupOnHide={true}>
            {children}
        </Dropdown>
    );
}

export default WalletOption;