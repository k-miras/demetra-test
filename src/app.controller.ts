import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import {KaspiResponse} from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/parse-product/:productId")
  parseProduct(@Param('productId') productId:number): Promise<KaspiResponse>  {
    return this.appService.parseProduct(productId);
  }

  @Get("/parse-min-price/:productId")
  parseMinPrice(@Param('productId') productId:number): Promise<number> {
    return this.appService.parseMinPrice(productId);
  }

  @Get("/parse-product/:productId/parse-seller-spot/:sellerId")
  parseSellerSpot(@Param('sellerId') sellerId:string,@Param('productId') productId: number):  Promise<number> {
    return this.appService.parseSellerSpot(productId,sellerId);
  }
}
