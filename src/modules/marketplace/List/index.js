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
import { CircularProgress } from '@mui/material'
import { authorize } from 'modules/user/api/loginSlice'
import { showMessage } from 'setup/messageSlice'
// import routes from 'setup/routes'
// import params from 'setup/config/params'
import { list } from 'modules/marketplace/api/query'
// import { save, remove } from 'modules/marketplace/api/mutation'
// import { URL_WEB } from 'setup/config/env'
import { ebayAuthUrl } from 'setup/oauth/ebay'
import marketplaceRemove from 'modules/marketplace/api/mutation/remove'

// Component
const List = ({ history, location }) => {
  // state
  const dispatch = useDispatch()
  // const ebay_tokens = window.localStorage.getItem('ebay_tokens')
  const user = JSON.parse(window.localStorage.getItem('user'))

  const [tokens, setTokens] = useState([])
  const [isLoading, isLoadingToggle] = useState(false)
  // const [marketplaces, setMarketplaces] = useState([])
  // const marketplaceEmpty = { text: '' }
  // const [marketplace, setMarketplace] = useState(marketplaceEmpty)

  // on load
  useEffect(() => {
    process()
  }, [])

  // process
  const process = async () => {
    isLoadingToggle(true)
    const query = queryString.parse(location.search)
    console.log('🚀 ~ file: index.js ~ line 48 ~ process ~ query', query)

    if (query.code && query.state) {
      try {
        const { data } = await authorize({ ...query, user: user.email })
        // const data = await ebayAuthToken.exchangeCodeForAccessToken(OAUTH_EBAY_ENV, query.code);
        if (data.data?.refresh_token) {
          // setTokens({ ...tokens, ebay_tokens: true })
          setTokens(data.data)
          isLoadingToggle(false)
        }
      } catch (error) {
        isLoadingToggle(false)
        dispatch(
          showMessage({
            message: error.message,
            autoHideDuration: 3000,
            variant: 'error',
          }),
        )
        console.error(error)
      }
    } else {
      const res = await list()
      if (res.data.success) {
        setTokens(res.data.data)
        isLoadingToggle(false)
        // const ebay = Object.entries(res.data.data).find(([key]) => key.includes('ebay'))[1];
        // const vinted = Object.fromEntries(Object.entries(res.data.data).filter(([key]) => key.includes('vinted')));
      }
    }
  }

  const handleDisconnect = async (data) => {
    // isLoadingToggle(true)
    const res = await marketplaceRemove(data)
    if (res.data.success) {
      if (data.type === 'ebay') {
        setTokens({ ...tokens, ebay_tokens: '' })
      } else if (data.type === 'vinted') {
        setTokens({ ...tokens, vinted_tokens: '' })
      }
    }
  }
  // render
  return (
    <div className='container-m'>
      {isLoading ? (
        <div className='loading'>
          <CircularProgress />
        </div>
      ) : (
        <>
          <h1 className='marketplace-title'>Pick a marketplace to connect</h1>

          <div className='marketplace-list'>
            <div className='marketplaces-item'>
              <div className='left'>
                <img
                  style={{ padding: '5px' }}
                  src='https://storage.googleapis.com/responsive-task-281907.appspot.com/static/dashboard/img/logo-ebay.ce13d60e3424.png'
                  alt='ebay logo'
                />
                {tokens.ebay_tokens && <p className='label'>Connected</p>}
              </div>
              <div className='right'>
                {tokens.ebay_tokens ? (
                  <button
                    onClick={() => handleDisconnect({ type: 'ebay' })}
                    className='disconnect-btn'
                  >
                    Disconnect
                  </button>
                ) : (
                  <a href={ebayAuthUrl}>
                    <button className='connect-btn'>Connect</button>
                  </a>
                )}
              </div>
            </div>
            <div className='marketplaces-item'>
              <div className='left'>
                <img
                  style={{ padding: '5px' }}
                  src='https://storage.googleapis.com/responsive-task-281907.appspot.com/static/dashboard/img/logo-vinted.675911d5af2c.png'
                  alt=''
                />
                {tokens.vinted_tokens && <p className='label'>Connected</p>}
              </div>
              <div className='right'>
                {tokens.vinted_tokens ? (
                  <button
                    onClick={() => handleDisconnect({ type: 'vinted' })}
                    className='disconnect-btn'
                  >
                    Disconnect
                  </button>
                ) : (
                  <button className='connect-btn'>Connect</button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default List
