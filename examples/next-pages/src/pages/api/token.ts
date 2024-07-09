import axios, { isAxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { code, wallet_signature } = req.body

    const clientId = process.env['NEXT_PUBLIC_DIDIT_CLIENT_ID'] || ''
    const clientSecret = process.env['DIDIT_CLIENT_SECRET'] || ''

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const headers = {
      Authorization: `Basic ${auth}`
    }

    const data = {
      code,
      grant_type: 'connect_wallet',
      wallet_signature
    }

    try {
      const token_response = await axios.post('https://apx.staging.didit.me/auth/v2/token/', data, {
        headers
      })
      res.status(token_response.status).json(token_response.data)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || { message: error?.message }
        res.status(error?.response?.status || 500).json(errorData)
      } else {
        res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default handler
