
export class TransactionService {
  constructor (url) {
    this.url = url
  }

  get (path) {
    return this._fetch(path, 'get')
  }

  post (path, parameters) {
    return this._fetch(path, 'post', parameters)
  }

  put (path, parameters) {
    return this._fetch(path, 'put', parameters)
  }

  delete (path, parameters) {
    return this._fetch(path, 'delete', parameters)
  }

  _fetch (path, method, body) {
    const headers = {
      'Content-Type': 'application/json'
    }
    const access = localStorage.getItem('accessToken')
    if (access) {
      headers.Authorization = `Bearer ${JSON.parse(access).jwt}`
    }
    path = `${this.url}${path}`
    const data = {
      method,
      headers
    }

    if (method !== 'get') {
      data.body = JSON.stringify(body)
    }

    return fetch(path, data)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Error en la petición')
        }
        return response.json()
      })
  }
}