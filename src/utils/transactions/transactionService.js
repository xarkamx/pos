
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
    path = `${this.url}${path}`
    const data = {
      method,
      headers
    }

    if (method !== 'get') {
      data.body = JSON.stringify(body)
    }

    return fetch(path, data)
      .then(response => response.json())
  }
}