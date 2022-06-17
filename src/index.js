// Imports
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as StateProvider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// UI imports
import 'ui/common/colors.css'
import 'ui/common/reset.css'

// App imports
import { store } from 'setup/store'
import routes from 'setup/routes'
import Layout from 'modules/common/Layout'
import RoutePrivate from 'modules/common/RoutePrivate'
import {
  loginSetUserLocalStorage,
  loginSetUser,
} from 'modules/user/api/actions/query'
import * as serviceWorker from './serviceWorker'
import axios from 'axios'

// User Authentication
const jwtToken = window.localStorage.getItem('jwtToken')
if (jwtToken && jwtToken !== 'undefined' && jwtToken !== '') {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (user) {
    loginSetUserLocalStorage(jwtToken, user)
    store.dispatch(loginSetUser(jwtToken, user))
  }
}

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

ReactDOM.render(
  <StateProvider store={store}>
    <Router>
      <Layout>
        <Switch>
          {Object.values(routes).map((route, index) =>
            route.auth ? (
              <RoutePrivate {...route} key={index} path={route.path} />
            ) : (
              <Route {...route} key={index} path={route.path} />
            ),
          )}
        </Switch>
      </Layout>
    </Router>
  </StateProvider>,
  document.getElementById('root'),
)

serviceWorker.unregister()
