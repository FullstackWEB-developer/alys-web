// Imports
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as queryString from 'query-string'
// import { Helmet } from 'react-helmet'
// import moment from 'moment'

// UI imports
// import Button from 'ui/Button'
// import Input from 'ui/Input'
import './style.css'

// App imports
// import {
//   setUserData,
// } from 'modules/user/api/loginSlice'
// import loginSetUserLocalStorage from 'modules/user/api/loginSetUserLocalStorage'
// import { authorize } from 'modules/user/api/loginSlice'
import routes from 'setup/routes'
// import params from 'setup/config/params'
// import { list } from 'modules/marketplace/api/actions/query'
// import { save, remove } from 'modules/marketplace/api/actions/mutation'
// import { URL_WEB } from 'setup/config/env'
import { ebayAuthToken, ebayAuthUrl } from 'setup/oauth/ebay'

// Component
const List = ({ history, location }) => {
  // state
  const dispatch = useDispatch()
  const ebay_refresh_token = window.localStorage.getItem('ebay_refresh_token')

  const [isLoading, isLoadingToggle] = useState(false)
  const [tokens, setTokens] = useState([])
  const [marketplaces, setMarketplaces] = useState([])
  const marketplaceEmpty = { text: '' }
  const [marketplace, setMarketplace] = useState(marketplaceEmpty)
  
  // const ebayAuthUrl = ebay.generateUserAuthorizationUrl('SANDBOX', scopes);

  // on load
  useEffect(() => {
    process()
  }, [])

  // process
  const process = async () => {
    const query = queryString.parse(location.search)

    if (query.code && query.state) {
      // let redirectTo = routes.pagesHome.path

      try {
        // const { data } = await authorize(query)
        const data = await ebayAuthToken.exchangeCodeForAccessToken('SANDBOX', query.code);

        if (data.refresh_token) {

          localStorage.setItem('ebay_refresh_token', data.refresh_token)

          // redirectTo = routes.userDashboard.path
        }
      } catch (error) {
        console.log(error)
      // } finally {
      //   history.push(redirectTo)
      }
    // } else {
    //   history.push(routes.pagesHome.path)
    }
  }

  // render
  return (
    <>
      <div class="container-m">
        <h1 class="marketplace-title">
          Pick a marketplace to connect
        </h1>

        <div class="marketplace-list">
          <div class="marketplaces-item">
            <div class="left">
              <img style={{ padding: "5px;" }} src="https://storage.googleapis.com/responsive-task-281907.appspot.com/static/dashboard/img/logo-ebay.ce13d60e3424.png" alt="ebay logo"/>
                {ebay_refresh_token && <p class="label">Connected</p>}
            </div>
            <div class="right">
              {ebay_refresh_token ? <button onClick={() => localStorage.removeItem('ebay_refresh_token')} class="disconnect-btn">Disconnect</button>
                : <a href={ebayAuthUrl}><button class="connect-btn">Connect</button></a>}
            </div>

          </div>
          <div class="marketplaces-item">
            <div class="left">
              <img  style={{ padding: '5px;' }} src="https://storage.googleapis.com/responsive-task-281907.appspot.com/static/dashboard/img/logo-vinted.675911d5af2c.png" alt="" />
            </div>
            <div class="right">
              {tokens.includes('ebay') ? <button class="disconnect-btn">Disconnect</button>
                : <button class="connect-btn">Connect</button>}
              {/* <span class="vinted-disabled-connect" data-tippy-content="To connect Vinted account, use Google Chrome with installed Zipsale extension." data-tippy-placement="left">
                Connect
              </span> */}
            </div>
          </div>

        </div>
      </div>







      {/* content */}
      {/* <section className='marketplace-list'>
        <h1>Pick a marketplace to connect</h1>
        <aside>
          <h4>
            Your marketplaces:{' '}
            {isLoading && (
              <img
                src={`${URL_WEB}/images/loader.gif`}
                alt='loading...'
                height={14}
              />
            )}
          </h4>

          <div className='list'>
            {marketplaces.length === 0 ? (
              <p>You have not added any marketplaces.</p>
            ) : (
              marketplaces.map((n) => (
                <div className='item' key={n._id}>
                </div>
              ))
            )}
          </div>
        </aside>
      </section> */}
    </>
  )
}

export default List
