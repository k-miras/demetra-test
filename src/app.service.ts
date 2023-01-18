import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  parseMinPrice(productId: number) : number{
    return productId;
  }
  parseSellerSpot(sellerId: number) : number{
    return sellerId;
  }
  parseProduct(productId:number): number {
    return productId;
  }
}
