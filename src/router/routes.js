import { lazy } from 'react'

const Index = lazy(() => import(/* webpackChunkName: "Index" */ '@/pages/index'))

const routes = [
  {
    path: '/',
    component: Index,
    exact: true
  }
]

export default routes
