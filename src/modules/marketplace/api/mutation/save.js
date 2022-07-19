// Imports
import axios from 'axios'

// App Imports
import { URL_API } from 'setup/config/env'

// Save
export default function save(data) {
  return axios.post(URL_API, {
    operation: 'marketplaceSave',
    params: data,
  })
}
