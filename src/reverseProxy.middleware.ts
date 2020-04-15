import { Injectable, NestMiddleware } from '@nestjs/common'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { Request, Response } from 'express'

@Injectable()
export class ReverseProxyMiddleware implements NestMiddleware {
  getTarget = originalUrl => {
    let target = ''
    if (originalUrl.startsWith('/api/v1/invoices/')) {
      target = 'http://localhost:3000'
    }
    return target
  }

  use(req: Request, res: Response, next: () => void) {
    const baseOptions = {
      secure: false,
      pathRewrite: {
        '^/api/v1': ''
      },
      onProxyReq: (proxyReq, req: Request) => {
        proxyReq.setHeader('userId', req.user.id)
      }
    }

    const target = this.getTarget(req.originalUrl)

    const options = {
      ...baseOptions,
      target
    }

    const proxy = createProxyMiddleware(options)

    proxy(req, res, next)
  }
}
