import { lazy } from 'react'

const Index = lazy(() => import(/* webpackChunkName: "Index" */ '@/pages/index'))
const L2wallet = lazy(() => import(/* webpackChunkName: "L2wallet" */ '@/pages/l2wallet'))

const routes = [
  {
    path: '/',
    component: Index,
    exact: true
  },
  {
    path: '/l2wallet',
    component: L2wallet,
    exact: true
  }
]

export default routes
