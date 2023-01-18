import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { parse } from 'node-html-parser';
import { firstValueFrom } from 'rxjs';
import { KaspiResponse } from './types';

@Injectable()
export class AppService {
  constructor(private http: HttpService) { }


  async parseMinPrice(productId: number): Promise<number> {
    const res = await this.kaspiRequest(productId);
    return res.price;
  }
  async parseSellerSpot(productId: number,sellerId: string): Promise<number> {
    const res = await this.kaspiRequest(productId);
    return res.offers.findIndex(o=>o.merchantId===sellerId) + 1;
  }
  async parseProduct(productId: number): Promise<KaspiResponse> {
    const res = await this.kaspiRequest(productId);
    return res;
  }

  async kaspiRequest(productId: number): Promise<KaspiResponse> {
    const cityId = 750000000;
    let productPage = await firstValueFrom(this.http.get(`https://kaspi.kz/shop/p/c-${productId}/?c=${cityId}`, {
      headers: {
        "Host": "kaspi.kz",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
      }
    }));
    let parsed = parse(productPage.data, { voidTag: { tags: [] } });
    const name = parsed.querySelector("[property=og:title]").getAttribute("content");
    const referrer = productPage.request.res.responseUrl;
    let pricePage = await firstValueFrom(this.http.post(`https://kaspi.kz/yml/offer-view/offers/${productId}`,
  {
    cityId,
    id: productId,
    limit: 30,
    page: 0,
    sort: true
  },
  {
    headers: {
      "Host": "kaspi.kz",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Referer": referrer,
      "Content-Type": "application/json"
    },
  }));
    const price = pricePage.data.offers[0].price;
    return { name, referrer, price, offers: pricePage.data.offers }
  }
}

