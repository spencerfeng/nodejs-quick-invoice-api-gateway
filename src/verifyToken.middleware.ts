import { Injectable, NestMiddleware, HttpService } from '@nestjs/common'
import { Request, Response } from 'express'

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string
      username: string
    }
  }
}

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(private httpService: HttpService) {}

  use(req: Request, res: Response, next: Function) {
    const reqHeaders = {
      Authorization: req.headers.authorization
    }

    this.httpService
      .post(
        'http://localhost:3002/auth/validate-token',
        {},
        { headers: reqHeaders }
      )
      .toPromise()
      .then(response => {
        console.log('response data', response.data)
        req.user = response.data
        next()
      })
      .catch(err => {
        if (
          err.response &&
          err.response.status === 401 &&
          err.response.data &&
          err.response.data.message
        ) {
          res.status(401).send({
            statusCode: 401,
            message: err.response.data.message
          })
          return
        }

        res.status(500).send({
          statusCode: 500,
          message: 'Internal Server Error'
        })
      })
  }
}
