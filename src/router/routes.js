import { lazy } from 'react'

const Index = lazy(() => import(/* webpackChunkName: "Index" */ '@/pages/index'))
const L2wallet = lazy(() => import(/* webpackChunkName: "L2wallet" */ '@/pages/l2wallet'))
const Swap = lazy(() => import(/* webpackChunkName: "Swap" */ '@/pages/swap'))
const Pool = lazy(() => import(/* webpackChunkName: "Pool" */ '@/pages/pool'))

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
  },
  {
    path: '/swap',
    component: Swap,
    exact: true
  },
  {
    path: '/pool',
    component: Pool,
    exact: true
  }
]

export default routes
