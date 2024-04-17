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

const mockFetchData = {
  Information: "",
  "Meta Data": {
    "1. Information":
      "Intraday (5min) open, high, low, close prices and volume",
    "2. Symbol": "IBM",
    "3. Last Refreshed": "2024-04-16 19:55:00",
    "4. Interval": "5min",
    "5. Output Size": "Compact",
    "6. Time Zone": "US/Eastern",
  },
  "Time Series (5min)": {
    "2024-04-16 19:55:00": {
      "1. open": "183.9900",
      "2. high": "183.9900",
      "3. low": "183.7600",
      "4. close": "183.7600",
      "5. volume": "16",
    },
  },
};

export default async function Page({
  params: { symbol },
}: {
  params: { symbol: string };
}) {
  const res = await fetch(
    `${API_BASE_URL}/query?function=${QUERY_FUNCTION_TIME_SERIES}&symbol=${symbol}&interval=${QUERY_INTERVAL}&apikey=${QUERY_API_KEY}`,
    { cache: "force-cache" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data.");
  }

  let fetchResponse: FetchResponse = await res.json();

  if (Object.keys(fetchResponse.Information.length)) {
    console.error("Failed to fetch data due to API request limitation.");
    fetchResponse = mockFetchData;
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
    <div className="py-8 lg:py-16 flex items-center px-6">
      <div className="text-center mx-auto inline-block">
        <div className="mb-2">
          <h1 className="text-3xl lg:text-6xl leading-tight max-w-3xl font-bold tracking-tight mt-6 mx-auto">
            {stockData.symbol}
          </h1>
          <div className="text-slate-500">
            {stockData.lastRefreshed.toDateString()}
          </div>
        </div>
        <div
          key={stockData.latestPrice.dateTime.getMilliseconds()}
          className="flex flex-row flex-wrap justify-center gap-6"
        >
          <div>
            <div className="text-slate-500">Closing price</div>
            <div className="text-xl font-medium">
              ${stockData.latestPrice.close}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Highest price</div>
            <div className="text-xl font-medium">
              ${stockData.latestPrice.high}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Lowest price</div>
            <div className="text-xl font-medium">
              ${stockData.latestPrice.low}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Volume</div>
            <div className="text-xl font-medium">
              {stockData.latestPrice.volume}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
