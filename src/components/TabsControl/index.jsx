import React, { useState, Children } from "react"
import { TransitionGroup, SwitchTransition, CSSTransition } from 'react-transition-group'
import "./index.scss"


export default function TabsControl(props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    return (
        <div className="tab">
            { /* 动态生成Tab导航 */}
            <div className="tab_title_wrap">
                {
                    Children.map(props.children, (element, index) => {
                        return (
                            <div onClick={() => { setCurrentIndex(index) }} className={index === currentIndex ? "tab_title active" : "tab_title"}>{element.props.name}</div>
                        )
                    })
                }
            </div>
            { /* Tab内容区域 */}
            <div className="tab_item_wrap">
                {
                    Children.map(props.children, (element, index) => {
                        return index === currentIndex ?
                            <SwitchTransition mode="out-in">
                                <CSSTransition
                                    key={'on'}
                                    classNames={'tab_item'}
                                    timeout={1000}
                                >
                                    <div className={'on'}>{element}</div>
                                </CSSTransition>
                            </SwitchTransition>
                            : 
                            <SwitchTransition mode="out-in">
                                <CSSTransition
                                    key={'off'}
                                    classNames={'tab_item'}
                                    timeout={1000}
                                >
                                    <div className={'off'}>{null}</div>
                                </CSSTransition>
                            </SwitchTransition>
                    })
                }
            </div>
        </div>
    )
}