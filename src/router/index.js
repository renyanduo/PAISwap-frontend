import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import routes from './routes'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false })

const LazyLoad = () => {
  useEffect(() => {
    NProgress.start()
    return () => {
      NProgress.done()
    }
  })
  return ''
}

const RouterView = () => (
  <BrowserRouter>
    <AppHeader/>
    <Suspense fallback={<LazyLoad />}>
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            component={route.component}
            exact={route.exact}></Route>
        ))}
        <Redirect to="/"></Redirect>
      </Switch>
    </Suspense>
    <AppFooter></AppFooter>
  </BrowserRouter>
)
export default RouterView
