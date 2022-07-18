import axios from 'axios';
import { OAUTH_EBAY_ENV, OAUTH_EBAY_ID, OAUTH_EBAY_SECRET, EBAY_RU_NAME, URL_WEB } from 'setup/config/env'
import routes from 'setup/routes'

// HTTP Header Constants
const HEADER_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const HEADER_PREFIX_BASIC = 'Basic ';
const HEADER_AUTHORIZATION = 'Authorization';

// HTTP Request
const PAYLOAD_VALUE_CLIENT_CREDENTIALS = 'client_credentials';
const PAYLOAD_VALUE_AUTHORIZATION_CODE = 'authorization_code';
const PAYLOAD_REFRESH_TOKEN = 'refresh_token';
const PAYLOAD_STATE = 'state';

// Web End point
const OAUTHENVIRONMENT_WEBENDPOINT_PRODUCTION = 'https://auth.ebay.com/oauth2/authorize';
const OAUTHENVIRONMENT_WEBENDPOINT_SANDBOX = 'https://auth.sandbox.ebay.com/oauth2/authorize';

// API End Point
const OAUTHENVIRONMENT_APIENDPOINT_SANDBOX = 'https://api.sandbox.ebay.com/identity/v1/oauth2/token';
const OAUTHENVIRONMENT_APIENDPOINT_PRODUCTION = 'https://api.ebay.com/identity/v1/oauth2/token';

// Scopes
const CLIENT_CRED_SCOPE = 'https://api.ebay.com/oauth/api_scope';

// Environments
// const PROD_ENV = 'PRODUCTION';
// const SANDBOX_ENV = 'SANDBOX';

const validateParams = (environment, scopes, credentials) => {
  if (!environment) throw new Error('Kindly provide the environment - PRODUCTION/SANDBOX');
  if (!scopes) throw new Error('scopes is required');
  if (!credentials) throw new Error('credentials configured incorrectly');
};

const readOptions = (options) => {
  const credentials = {};
  if (!options.env) options.env = 'PRODUCTION';
  options.baseUrl = options.env === 'PRODUCTION' ? 'api.ebay.com' : 'api.sandbox.ebay.com';
  credentials[options.env] = { ...options };
  return credentials;
};

const base64Encode = (encodeData) => {
  // const buff = new Buffer.from(encodeData); // eslint-disable-line 
  const buff = window.btoa(encodeData);
  // buff.toString('base64');
  return buff;
};

const postRequest = (data, ebayAuthToken) => {
  const encodedStr = base64Encode(`${ebayAuthToken.clientId}:${ebayAuthToken.clientSecret}`);
  const auth = `Basic ${encodedStr}`;
  return new Promise((resolve, reject) => {
    // delete axios.defaults.headers.common['Authentication']
    const response = fetch(`https://${ebayAuthToken.baseUrl}/identity/v1/oauth2/token`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        // 'Content-Length': data.length,
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      // redirect: 'follow', // manual, *follow, error
      // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    // const response = axios({
    //   url: `https://${ebayAuthToken.baseUrl}/identity/v1/oauth2/token`,
    //   method: 'POST',
    //   data,
    //   headers: {
    //     'Content-Length': data.length,
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Authorization': auth
    //   },
    //   // headers: {
    //   //   Authorization: `Bearer ${ebayToken}`,
    //   //   Accept: 'application/json',
    //   //   'Content-Type': 'application/json',
    //   // },
    // })
    if (!response.ok) {
      reject(response.data);
    }
    console.log("🚀 ~ file: ebay.js ~ line 87 ~ returnnewPromise ~ response", response)
    console.log("🚀 ~ file: ebay ~ response.json()", response.json())
    resolve(response.data);
  });
};

class EbayOauthToken {
  constructor(options) {
    if (!options) {
      throw new Error('This method accepts an object with filepath or with client id and client secret');
    }
    // get user credentials.
    this.credentials = readOptions(options);
    this.grantType = '';
    return this;
  }

  /**
  * generate application access toke for client credentials grant flow.
  * @param environment Environment (production/sandbox).
  * @param scopes array list of scopes for which you need to generate the access token.
  * @return accessToken object.
 */
  getApplicationToken(environment, scopes = CLIENT_CRED_SCOPE) {
    validateParams(environment, scopes, this.credentials);
    this.grantType = PAYLOAD_VALUE_CLIENT_CREDENTIALS;
    this.scope = Array.isArray(scopes) ? scopes.join('%20') : scopes;
    const data = JSON.stringify({
      grant_type: this.grantType,
      scope: this.scope
    });
    return postRequest(data, this.credentials[environment]);
  }

  /**
   * generate user consent authorization url.
   * @param {string} environment Environment (production/sandbox).
   * @param {string[]} scopes array list of scopes for which you need to generate the access token.
   * @param {Object} options optional values
   * @param {string} options.state custom state value
   * @param {string} options.prompt enforce to log in
   * @return userConsentUrl
  */
  generateUserAuthorizationUrl(environment, scopes, options) {
    validateParams(environment, scopes, this.credentials);
    const credentials = this.credentials[environment];
    if (!credentials) throw new Error('Error while reading the credentials, Kindly check here to configure');
    if (!credentials.redirectUri) throw new Error('redirect_uri is required for redirection after sign in \n kindly check here https://developer.ebay.com/api-docs/static/oauth-redirect-uri.html');
    if (options && typeof (options) !== 'object') throw new Error('Improper way to provide optional values');
    this.scope = Array.isArray(scopes) ? scopes.join('%20') : scopes;
    const { prompt, state } = options || {};
    let queryParam = `client_id=${credentials.clientId}`;
    queryParam = `${queryParam}&redirect_uri=${credentials.redirectUri}`;
    queryParam = `${queryParam}&response_type=code`;
    queryParam = `${queryParam}&scope=${this.scope}`;
    queryParam = prompt ? `${queryParam}&prompt=${prompt}` : queryParam;
    queryParam = state ? `${queryParam}&state=${state}` : queryParam;
    const baseUrl = environment === 'PRODUCTION' ? OAUTHENVIRONMENT_WEBENDPOINT_PRODUCTION
      : OAUTHENVIRONMENT_WEBENDPOINT_SANDBOX; // eslint-disable-line 
    return `${baseUrl}?${queryParam}`;
  }

  /**
   * Getting a User access token.
   * @param environment Environment (production/sandbox).
   * @param code code generated from browser using the method generateUserAuthorizationUrl.
   * @return accessToken object.
  */
  exchangeCodeForAccessToken(environment, code) {
    if (!code) {
      throw new Error('Authorization code is required');
    }
    validateParams(environment, true, this.credentials[environment]);
    const credentials = this.credentials[environment];
    const data = `code=${code}&grant_type=${PAYLOAD_VALUE_AUTHORIZATION_CODE}&redirect_uri=${credentials.redirectUri}`; // eslint-disable-line 
    return postRequest(data, credentials);
  }

  /**
   * Using a refresh token to update a User access token (Updating the expired access token).
   * @param environment Environment (production/sandbox).
   * @param refreshToken refresh token.
   * @param scopes array list of scopes for which you need to generate the access token.
   * @return accessToken object.
  */
  getAccessToken(environment, refreshToken, scopes) {
    const token = refreshToken || this.getRefreshToken();
    validateParams(environment, scopes, this.credentials);
    this.scope = Array.isArray(scopes) ? scopes.join('%20') : scopes;
    if (!token) {
      throw new Error('Refresh token is required, to generate refresh token use exchangeCodeForAccessToken method'); // eslint-disable-line max-len
    }
    const data = `refresh_token=${token}&grant_type=${PAYLOAD_REFRESH_TOKEN}&scope=${this.scope}`;
    return postRequest(data, this.credentials[environment]);
  }

  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }
}



export const scopes = [
  'https://api.ebay.com/oauth/api_scope',
  // 'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
  // 'https://api.ebay.com/oauth/api_scope/sell.marketing',
  // 'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
  'https://api.ebay.com/oauth/api_scope/sell.inventory',
  // 'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
  // 'https://api.ebay.com/oauth/api_scope/sell.account',
]
export const ebayAuthToken = new EbayOauthToken({
  env: OAUTH_EBAY_ENV,
  clientId: OAUTH_EBAY_ID,
  clientSecret: OAUTH_EBAY_SECRET,
  redirectUri: EBAY_RU_NAME,
});

export const ebayAuthUrl = ebayAuthToken.generateUserAuthorizationUrl(OAUTH_EBAY_ENV, scopes, {
  state: 'ebay',
});

// (async () => {
//   const accessToken = await ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION',  code);
//   console.log(accessToken);
// })();
