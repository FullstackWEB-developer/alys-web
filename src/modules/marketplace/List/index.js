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
import { authorize } from 'modules/user/api/loginSlice'
import { showMessage } from 'setup/messageSlice';
import routes from 'setup/routes'
// import params from 'setup/config/params'
import { list } from 'modules/marketplace/api/query'
// import { save, remove } from 'modules/marketplace/api/mutation'
import { URL_WEB } from 'setup/config/env'
import { ebayAuthToken, ebayAuthUrl } from 'setup/oauth/ebay'
import { CircularProgress } from '@mui/material'

// Component
const List = ({ history, location }) => {
  // state
  const dispatch = useDispatch()
  // const ebay_refresh_token = window.localStorage.getItem('ebay_refresh_token')
  const user = JSON.parse(window.localStorage.getItem('user'))

  const [tokens, setTokens] = useState([])
  const [isLoading, isLoadingToggle] = useState(false)
  // const [marketplaces, setMarketplaces] = useState([])
  // const marketplaceEmpty = { text: '' }
  // const [marketplace, setMarketplace] = useState(marketplaceEmpty)

  // const ebayAuthUrl = ebay.generateUserAuthorizationUrl(OAUTH_EBAY_ENV, scopes);

  // on load
  useEffect(() => {
    process()
  }, [])

  // process
  const process = async () => {
    isLoadingToggle(true)
    const query = queryString.parse(location.search)
    console.log("🚀 ~ file: index.js ~ line 48 ~ process ~ query", query)

    if (query.code && query.state) {
      try {
        const { data } = await authorize({ ...query, user: user.email })
        // const data = await ebayAuthToken.exchangeCodeForAccessToken(OAUTH_EBAY_ENV, query.code);
        console.log("🚀 ~ file: index.js ~ line 56 ~ process ~ data", data)

        if (data.data?.refresh_token) {
          setTokens({ ...tokens, ebay_refresh_token: data.data.refresh_token })
          isLoadingToggle(false)
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      const res = await list()
      if (res.data.success) {
        setTokens(res.data.data)
        isLoadingToggle(false)
        // const ebay = Object.entries(res.data.data).find(([key]) => key.includes('ebay'))[1];
        // const vinted = Object.fromEntries(Object.entries(res.data.data).filter(([key]) => key.includes('vinted')));
        dispatch(showMessage({
          variant: 'success',
          message: res.data.message,
        }))
      } else {
        dispatch(showMessage({
          message: res.data.message,
          autoHideDuration: 2000,
          variant: 'error',
        }));
      }
    }
  }

  // render
  return (
    <div className="container-m">
      {(isLoading) ? (
        <div className="loading">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h1 className="marketplace-title">
            Pick a marketplace to connect
          </h1>

          <div className="marketplace-list">
            <div className="marketplaces-item">
              <div className="left">
                <img style={{ padding: "5px" }} src="https://storage.googleapis.com/responsive-task-281907.appspot.com/static/dashboard/img/logo-ebay.ce13d60e3424.png" alt="ebay logo" />
                {tokens.ebay_refresh_token && <p className="label">Connected</p>}
              </div>
              <div className="right">
                {tokens.ebay_refresh_token ? <button onClick={() => localStorage.removeItem('ebay_refresh_token')} className="disconnect-btn">Disconnect</button>
                  : <a href={ebayAuthUrl}><button className="connect-btn">Connect</button></a>}
              </div>

            </div>
            <div className="marketplaces-item">
              <div className="left">
                <img style={{ padding: '5px' }} src="https://storage.googleapis.com/responsive-task-281907.appspot.com/static/dashboard/img/logo-vinted.675911d5af2c.png" alt="" />
                {tokens.vinted_refresh_token && <p className="label">Connected</p>}
              </div>
              <div className="right">
                {tokens.vinted_refresh_token ? <button className="disconnect-btn">Disconnect</button>
                  : <button className="connect-btn">Connect</button>}
              </div>
            </div>

          </div>
        </>)}
    </div>
  )
}

export default List
