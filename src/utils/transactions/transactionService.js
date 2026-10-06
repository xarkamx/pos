import { objectToSerialize } from '../../core/helpers'
import { ErrorObj } from '../../errors/ErrorObj'

export class TransactionService {
  constructor (url) {
    this.url = url
  }

  get (path, parameters = null) {
    if (parameters) {
      path = `${path}?${objectToSerialize(parameters)}`
    }
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

  async file (path, filename = 'download') {
    // js fetch download file
    const headers = getHeaders()
    path = `${this.url}${path}`
    const resp = await fetch(path, {
      method: 'GET',
      headers
    })
    if (!resp.ok) {
      throw new Error('No se pudo descargar el archivo')
    }
    const file = await resp.blob()
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    try {
      link.click()
    } finally {
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }

  async _fetch (path, method, body) {
    const headers = getHeaders()
    path = `${this.url}${path}`
    const data = {
      method,
      headers
    }

    if (method !== 'get') {
      data.body = JSON.stringify(body)
    }

    if (!body) {
      delete headers['Content-Type']
    }

    const resp = await fetch(path, data)
    if (resp.status >= 400) {
      throw new ErrorObj(await resp.json())
    }
    return resp.json()
  }


}

function getHeaders () {
  const headers = {
    'Content-Type': 'application/json'
  }
  const access = localStorage.getItem('accessToken')
  if (access) {
    headers.Authorization = `Bearer ${JSON.parse(access).jwt}`
  }
  return headers
}
