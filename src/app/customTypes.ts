export type Stock = {
  assetType: string;
  delistingDate: string;
  exchange: string;
  ipoDate: string;
  name: string;
  status: string;
  symbol: string;
};

export type StockData = {
  symbol: string;
  lastRefreshed: Date;
  latestPrice: StockPrice;
  stockPricesByTime: StockPrice[];
};

export type StockPrice = {
  dateTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};
