import { useEffect } from 'react';
import ReactDOM from 'react-dom';
const node = document.createElement('div');
function OldPortal(props) {
  const { visible, children } = props;
  useEffect(() => {
    document.body.appendChild(node)
  }, [])
  return visible && ReactDOM.createPortal(
    children, // 渲染的元素为当前的children
    node,      // 将元素渲染到我们新建的node中,这里我们不使用第四个参数回调.
  );;
}
export default OldPortal