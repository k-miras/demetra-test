import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/parse-product/:productId")
  parseProduct(@Param('productId') productId:number): string {
    return this.appService.parseProduct(productId).toString();
  }

  @Get("/parse-min-price/:productId")
  parseMinPrice(@Param('productId') productId:number): string {
    return this.appService.parseMinPrice(productId).toString();
  }

  @Get("/parse-seller-spot/:sellerId")
  parseSellerSpot(@Param('sellerId') sellerId:number): string {
    return this.appService.parseSellerSpot(sellerId).toString();
  }
}
