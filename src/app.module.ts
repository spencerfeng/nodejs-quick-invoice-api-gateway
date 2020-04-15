import {
  Module,
  NestModule,
  MiddlewareConsumer,
  HttpModule
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ReverseProxyMiddleware } from './reverseProxy.middleware'
import { VerifyTokenMiddleware } from './verifyToken.middleware'
import { InvoicesModule } from './invoices/invoices.module'

@Module({
  imports: [InvoicesModule, HttpModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware, ReverseProxyMiddleware)
      .forRoutes('invoices')
  }
}
