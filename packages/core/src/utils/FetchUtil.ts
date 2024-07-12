/* eslint-disable require-unicode-regexp */
// -- Types ----------------------------------------------------------------------
interface Options {
  baseUrl: string
}

interface RequestArguments {
  path: string
  headers?: HeadersInit
  params?: Record<string, string | undefined>
  signal?: AbortSignal
}

interface PostArguments extends RequestArguments {
  body?: Record<string, unknown> | URLSearchParams
}

async function fetchData(...args: Parameters<typeof fetch>) {
  const response = await fetch(...args)
  if (!response.ok) {
    const data = await response.json()
    const err = new Error(`HTTP status code: ${response.status}. reason: ${data}`)
    throw err
  }

  return response
}

// -- Utility --------------------------------------------------------------------
export class FetchUtil {
  public baseUrl: Options['baseUrl']

  public constructor({ baseUrl }: Options) {
    this.baseUrl = baseUrl
  }

  public async get<T>({ headers, signal, ...args }: RequestArguments) {
    const url = this.createFullUrl(this.baseUrl, args)
    const response = await fetchData(url, { method: 'GET', headers, signal, cache: 'no-cache' })

    return response.json() as T
  }

  public async getBlob({ headers, signal, ...args }: RequestArguments) {
    const url = this.createFullUrl(this.baseUrl, args)
    const response = await fetchData(url, { method: 'GET', headers, signal })

    return response.blob()
  }

  public async post<T>({ body, headers, signal, ...args }: PostArguments) {
    const url = this.createFullUrl(this.baseUrl, args)
    let _body: URLSearchParams | string | undefined = undefined
    if (body instanceof URLSearchParams) {
      _body = body
    } else {
      _body = body ? JSON.stringify(body) : undefined
    }
    const response = await fetchData(url, {
      method: 'POST',
      headers,
      body: _body,
      signal
    })

    return response.json() as T
  }

  public async put<T>({ body, headers, signal, ...args }: PostArguments) {
    const url = this.createFullUrl(this.baseUrl, args)
    let _body: URLSearchParams | string | undefined = undefined
    if (body instanceof URLSearchParams) {
      _body = body
    } else {
      _body = body ? JSON.stringify(body) : undefined
    }
    const response = await fetchData(url, {
      method: 'PUT',
      headers,
      body: _body,
      signal
    })

    return response.json() as T
  }

  public async delete<T>({ body, headers, signal, ...args }: PostArguments) {
    const url = this.createFullUrl(this.baseUrl, args)
    let _body: URLSearchParams | string | undefined = undefined
    if (body instanceof URLSearchParams) {
      _body = body
    } else {
      _body = body ? JSON.stringify(body) : undefined
    }
    const response = await fetchData(url, {
      method: 'DELETE',
      headers,
      body: _body,
      signal
    })

    return response.json() as T
  }

  public async getWithBaseUrl<T>(baseUrl: string, { headers, signal, ...args }: RequestArguments) {
    const url = this.createFullUrl(baseUrl, args)
    const response = await fetchData(url, { method: 'GET', headers, signal, cache: 'no-cache' })

    const text = await response.text()
    if (text) {
      return response.json() as T
    }

    return {} as T
  }

  public async postWithBaseUrl<T>(
    baseUrl: string,
    { body, headers, signal, ...args }: PostArguments
  ) {
    const url = this.createFullUrl(baseUrl, args)
    let _body: URLSearchParams | string | undefined = undefined
    if (body instanceof URLSearchParams) {
      _body = body
    } else {
      _body = body ? JSON.stringify(body) : undefined
    }
    const response = await fetchData(url, {
      method: 'POST',
      headers,
      body: _body,
      signal
    })

    return response.json() as T
  }

  createFullUrl(baseUrl: string, { path, params }: RequestArguments) {
    // Remove any trailing slashes from the base URL
    let _baseUrl = baseUrl.replace(/\/+$/, '')

    // Handle cases where the base URL is just a path (e.g., /api)
    if (!_baseUrl.match(/^https?:\/\//)) {
      if (_baseUrl.startsWith('/')) {
        _baseUrl = `${window.location.origin}${_baseUrl}`
      } else {
        _baseUrl = `${window.location.origin}/${_baseUrl}`
      }
    }

    let _path = path
    // Ensure the path starts with a slash
    if (!path.startsWith('/')) {
      _path = `/${path}`
    }

    // Concatenate the base URL and the path
    const url = new URL(_baseUrl + _path)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value)
        }
      })
    }

    return url
  }
}
