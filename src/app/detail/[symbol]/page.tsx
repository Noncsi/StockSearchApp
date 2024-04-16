import React from "react";
import {
  API_BASE_URL,
  QUERY_API_KEY,
  QUERY_FUNCTION_TIME_SERIES,
  QUERY_INTERVAL,
} from "../../constants";

interface FetchResponse {
  Information: string;
  "Meta Data": {
    "2. Symbol": string;
    "3. Last Refreshed": string;
  };
  "Time Series (5min)": {
    [key: string]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    };
  };
}

type StockData = {
  symbol: string;
  lastRefreshed: Date;
  latestPrice: StockPrice;
  stockPricesByTime: StockPrice[];
};

type StockPrice = {
  dateTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export default async function Page({
  params: { symbol },
}: {
  params: { symbol: string };
}) {
  const res = await fetch(
    `${API_BASE_URL}/query?function=${QUERY_FUNCTION_TIME_SERIES}&symbol=${symbol}&interval=${QUERY_INTERVAL}&apikey=${QUERY_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data.");
  }

  const fetchResponse: FetchResponse = await res.json();

  if (Object.keys(fetchResponse.Information.length)) {
    throw new Error("Failed to fetch data due to API request limitation.");
  }

  const timestampKeys = Object.keys(fetchResponse["Time Series (5min)"]);
  const stockPrices: StockPrice[] = [];
  timestampKeys.forEach((timeStamp) => {
    stockPrices.push({
      dateTime: new Date(timeStamp),
      open: Number(fetchResponse["Time Series (5min)"][timeStamp]["1. open"]),
      high: Number(fetchResponse["Time Series (5min)"][timeStamp]["2. high"]),
      low: Number(fetchResponse["Time Series (5min)"][timeStamp]["3. low"]),
      close: Number(fetchResponse["Time Series (5min)"][timeStamp]["4. close"]),
      volume: Number(
        fetchResponse["Time Series (5min)"][timeStamp]["5. volume"]
      ),
    });
  });

  let stockData: StockData = {
    symbol: fetchResponse["Meta Data"]["2. Symbol"],
    lastRefreshed: new Date(fetchResponse["Meta Data"]["3. Last Refreshed"]),
    latestPrice: stockPrices[0],
    stockPricesByTime: stockPrices,
  };

  return (
    <main>
      <h1 className="text-thd-color-violet-90 thd-max-xl thd-heading-lg mb-md">
        {stockData.symbol}
      </h1>
      <div className="text-slate-500">
        {stockData.lastRefreshed.toDateString()}
      </div>
      <div key={stockData.latestPrice.dateTime.getMilliseconds()}>
        <div>
          <div className="text-slate-500">closing price: </div>
          <div className="text-xl font-medium">
            ${stockData.latestPrice.close}
          </div>
          <div className="text-slate-500">highest price: </div>
          <div className="text-xl font-medium">
            ${stockData.latestPrice.high}
          </div>
          <div className="text-slate-500">lowest price: </div>
          <div className="text-xl font-medium">
            ${stockData.latestPrice.low}
          </div>
          <div className="text-slate-500">volume: </div>
          <div className="text-xl font-medium">
            {stockData.latestPrice.volume}
          </div>
        </div>
      </div>
    </main>
  );
}
