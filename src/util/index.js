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


export const openNotificationWithIcon = (type, msg, close = false) => {
  console.log(close);
  notification[type]({
      message: type.toUpperCase(),
      description: msg,
      duration: close ? 2000 : null
  });
  if (close) {
    setTimeout(() => {
      notification.destroy()
    }, 2000);
  }
};