import { NextResponse } from "next/server"

// Generic fetchBackend function for Server Actions and API routes
export async function fetchBackend<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: unknown
    requireAuth?: boolean
    returnNextResponse?: boolean
  } = {}
): Promise<NextResponse | T> {
  const { method = 'GET', body, requireAuth = false, returnNextResponse = false } = options

  try {
    const backendUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api'
    const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const fullUrl = `${backendUrl}${endpointPath}`
    const url = new URL(fullUrl)

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
    })

    const fetchOptions: RequestInit = {
      method,
      headers,
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    const response = await fetch(url.toString(), fetchOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      console.error('[handleApiResponse] Request failed:', response.status, errorData)

      if (returnNextResponse) {
        return NextResponse.json(
          { error: errorData.message || 'Backend request failed' },
          { status: response.status }
        )
      }

      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    return returnNextResponse ? NextResponse.json(data) : data

  } catch (error) {
    if (returnNextResponse) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred')
  }
}