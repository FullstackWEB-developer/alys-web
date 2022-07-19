// Imports
import axios from 'axios'

// App Imports
import { URL_API } from 'setup/config/env'

// Get list
// export function list() {
//   return axios.post(URL_API, {
//     operation: 'noteList',
//   })
// }

// Marketplace
export default function list() {
  return axios.post(URL_API, {
    operation: 'marketplaceList',
    // params: query,
  })
  // if (res.data.success) {
  //   // const ebay = Object.entries(res.data.data).find(([key]) => key.includes('ebay'))[1];
  //   // const vinted = Object.fromEntries(Object.entries(res.data.data).filter(([key]) => key.includes('vinted')));
  //   return res.data
  // } else {
  //   return []
  // }
}
