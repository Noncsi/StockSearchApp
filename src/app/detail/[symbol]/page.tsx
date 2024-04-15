import React from "react";
import {
  API_BASE_URL,
  QUERY_API_KEY,
  QUERY_FUNCTION_TIME_SERIES,
  QUERY_INTERVAL,
} from "../../constants";

interface FetchResponse {
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
    throw new Error("Failed to fetch data");
  }

  const fetchResponse: FetchResponse = await res.json();

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

  const stockData: StockData = {
    symbol: fetchResponse["Meta Data"]["2. Symbol"],
    lastRefreshed: new Date(fetchResponse["Meta Data"]["3. Last Refreshed"]),
    stockPricesByTime: stockPrices,
  };
  return (
    <main>
      <p>{stockData.symbol}</p>
      <p>{stockData.lastRefreshed.toDateString()}</p>
      <ul>
        {stockData.stockPricesByTime.map((price) => (
          <div key={price.dateTime.getMilliseconds()}>
            <li>time: {price.dateTime.toTimeString()}</li>
            <li>closing price: ${price.close}</li>
            <li>highest price: ${price.high}</li>
            <li>lowest price: ${price.low}</li>
            <li>volume: {price.volume}</li>
          </div>
        ))}
      </ul>
    </main>
  );
}
