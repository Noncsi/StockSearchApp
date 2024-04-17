import React from "react";
import {
  API_BASE_URL,
  QUERY_API_KEY,
  QUERY_FUNCTION_TIME_SERIES,
  QUERY_INTERVAL,
} from "../../constants";
import { StockPrice, StockData } from "@/app/customTypes";
import LabelValuePairComponent from "@/app/components/labelValuePairComponent";

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
  params: { stockSymbol },
}: {
  params: { stockSymbol: string };
}) {
  const url = `${API_BASE_URL}/query?function=${QUERY_FUNCTION_TIME_SERIES}&symbol=${stockSymbol}&interval=${QUERY_INTERVAL}&apikey=${QUERY_API_KEY}`;
  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }

  let fetchResponse: FetchResponse = await response.json();

  if (Object.keys(fetchResponse.Information.length)) {
    console.error("Failed to fetch data due to API request limitation.");
    fetchResponse = mockFetchData;
  }

  const timeSeries = fetchResponse["Time Series (5min)"];
  const timestampKeys = Object.keys(timeSeries);

  const stockPrices: StockPrice[] = timestampKeys.map((timestamp) => ({
    dateTime: new Date(timestamp),
    open: Number(timeSeries[timestamp]["1. open"]),
    high: Number(timeSeries[timestamp]["2. high"]),
    low: Number(timeSeries[timestamp]["3. low"]),
    close: Number(timeSeries[timestamp]["4. close"]),
    volume: Number(timeSeries[timestamp]["5. volume"]),
  }));

  const meta = fetchResponse["Meta Data"];
  const symbol = meta["2. Symbol"];
  const lastRefreshed = new Date(meta["3. Last Refreshed"]);

  const stockData: StockData = {
    symbol,
    lastRefreshed,
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

        <div className="flex flex-row flex-wrap justify-center gap-6">
          <LabelValuePairComponent
            label={"Closing price"}
            value={stockData.latestPrice.close.toString()}
            isPrice={true}
          ></LabelValuePairComponent>
          <LabelValuePairComponent
            label={"Highest price"}
            value={stockData.latestPrice.high.toString()}
            isPrice={true}
          ></LabelValuePairComponent>
          <LabelValuePairComponent
            label={"Lowest price"}
            value={stockData.latestPrice.low.toString()}
            isPrice={true}
          ></LabelValuePairComponent>
          <LabelValuePairComponent
            label={"Volume"}
            value={stockData.latestPrice.close.toString()}
          ></LabelValuePairComponent>
        </div>
      </div>
    </div>
  );
}
