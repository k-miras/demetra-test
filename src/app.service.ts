import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { parse } from 'node-html-parser';
import { firstValueFrom } from 'rxjs';
import { KaspiResponse, Offer } from './types';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(private http: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) { }


  async parseMinPrice(productId: number): Promise<number> {
    const res = await this.kaspiRequest(productId);
    return res.price;
  }
  async parseSellerSpot(productId: number, sellerId: string): Promise<number> {
    const res = await this.kaspiRequest(productId);
    return res.offers.findIndex(o => o.merchantId === sellerId) + 1;
  }
  async parseProduct(productId: number): Promise<KaspiResponse> {
    const res = await this.kaspiRequest(productId);
    return res;
  }

  private async kaspiRequest(productId: number): Promise<KaspiResponse> {

    const cityId = 750000000;
    let product = await this.cacheService.wrap(`product|${productId}`, () => this.fetchProduct(productId, cityId), 360000)
    let prices = await this.cacheService.wrap(`prices|${productId}`, () => this.fetchPrices(productId, cityId, product.referrer), 3600)
    return { ...product, ...prices }
  }




  private async fetchProduct(productId, cityId): Promise<ParsedProduct> {
    const productPage = await firstValueFrom(this.http.get(`https://kaspi.kz/shop/p/c-${productId}/?c=${cityId}`, {
      headers: {
        "Host": "kaspi.kz",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
      }
    }));
    let parsed = parse(productPage.data, { voidTag: { tags: [] } });
    const name = parsed.querySelector("[property=og:title]").getAttribute("content");
    const referrer = productPage.request.res.responseUrl;
    return { name, referrer }
  }

  private async fetchPrices(productId, cityId, referrer): Promise<ParsedOffers> {
    const body = {
      cityId,
      id: productId,
      limit: 30,
      page: 0,
      sort: true
    };
    const options = {
      headers: {
        "Host": "kaspi.kz",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Referer": referrer,
        "Content-Type": "application/json"
      },
    };
    let pricePage = await firstValueFrom(this.http.post(`https://kaspi.kz/yml/offer-view/offers/${productId}`,
      body, options
    ));
    const price = pricePage.data.offers[0].price;
    const offers = pricePage.data.offers;
    return { price, offers }
  }
}

type ParsedProduct = { name: string, referrer: string }
type ParsedOffers = { price: number, offers: Offer[] }

