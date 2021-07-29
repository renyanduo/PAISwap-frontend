import React, { useState, useEffect } from 'react'
import './index.scss'
import { Tabs, Form, Input } from 'antd'

const Index = () => {
  const { TabPane } = Tabs

  return (
    <div className="main">
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Deposit" key="1">
          <Form layout="vertical">
            <Form.Item label="Deposit from L1 account">
              <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item label="Deposit amount">
              <Input placeholder="input placeholder" />
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Withdraw" key="2">
        <Form.Item label="Withdraw address">
              <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item label="Withdraw amount">
              <Input placeholder="input placeholder" />
            </Form.Item>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Index
