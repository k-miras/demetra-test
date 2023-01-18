export type KaspiResponse = {
    name: string,
    referrer: string, 
    price: number, 
    offers: Offer[]
  }
  
  export type Offer = {
    merchantId: string,
    merchantName: string,
    merchantReviewsQuantity: number,
    merchantRating: number,
    price: number,
  
  }
  