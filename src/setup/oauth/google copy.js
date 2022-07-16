// Imports
import * as queryString from 'query-string'

// App imports
import { URL_WEB, OAUTH_EBAY_ID } from 'setup/config/env'
import params from 'setup/config/params'
import routes from 'setup/routes'

// google
export default function google() {
  const url = queryString.stringifyUrl(
    {
      url: 'https://accounts.google.com/o/oauth2/v2/auth',
      query: {
        client_id: OAUTH_EBAY_ID,
        redirect_uri: `${URL_WEB}${routes.pagesAuthorize.path}/`,
        scope: [
          'https://api.ebay.com/oauth/api_scope',
          'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
          'https://api.ebay.com/oauth/api_scope/sell.marketing',
          'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
          'https://api.ebay.com/oauth/api_scope/sell.inventory',
          'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
          'https://api.ebay.com/oauth/api_scope/sell.account',
        ].join(' '),
        response_type: 'code',
        // access_type: 'offline',
        // prompt: 'consent',
        state: 'ebay',
      },
    },
    { encode: false },
  )

  console.log(url)

  return url
}
