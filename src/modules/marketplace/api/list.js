// Imports
import axios from 'axios'

// App Imports
import { URL_API } from 'setup/config/env'

// Get list
export function list() {
  return axios.post(URL_API, {
    operation: 'noteList',
  })
}

// Marketplace
export function marketplace(query) {
  return axios.post(URL_API, {
    operation: 'userMarketplace',
    params: query,
  })
}
