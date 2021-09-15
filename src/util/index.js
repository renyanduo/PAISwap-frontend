import { notification } from 'antd';

export function numFormat(num) {
  num = num.toString().split('.') // 分隔小数点
  var arr = num[0].split('').reverse() // 转换成字符数组并且倒序排列
  var res = []
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i % 3 === 0 && i !== 0) {
      res.push(',') // 添加分隔符
    }
    res.push(arr[i])
  }
  res.reverse() // 再次倒序成为正确的顺序
  if (num[1]) {
    // 如果有小数的话添加小数部分
    res = res.join('').concat('.' + num[1].substr(0, 4))
  } else {
    res = res.join('')
  }
  return res
}


export const openNotificationWithIcon = (type, msg) => {
  notification[type]({
      message: type.toUpperCase(),
      description: msg
  });
};

/**
 * 保留小数位
 * @param {*} dight 小数
 * @param {*} bits 位数默认4
 * @returns 
 */
export const toFixed = ( dight, bits = 4 ) => {
  return (Math.round( dight * Math.pow( 10, bits ) ) / Math.pow( 10, bits )).toString()
}

/**
 * 分割省略 aa...bb
 * @param {*} text 字符串
 * @param {*} start 开始保留几位
 * @param {*} end 结束保留几位
 * @returns {*} text
 */
 export function subSplit(text, start, end) {
  if (text && text !== " ") {
    return text.substr(0, start) + '...' + text.substr(text.length - end, text.length);
  }
  return null
}

/**
 * pai链一天出块数
 */
 export const paiChainBlockToDay = 86400


 /**
 * 小数转百分比
 * @param {*} point 小数
 * @returns 
 */
export function toPercent(point) {
  const formated = Number(point * 100);
  const y = String(formated).indexOf(".") + 1;//获取小数点的位置
  if (y > 0) {
    return `${formated.toFixed(2)}%`
  } else {
    return `${formated}%`
  }
}