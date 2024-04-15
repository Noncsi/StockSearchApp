import AutoComplete from "./components/AutoComplete";
import {
  API_BASE_URL,
  QUERY_FUNCTION_LISTING_STATUS,
  QUERY_API_KEY,
} from "./constants";
import styles from "./page.module.css";

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

export default async function Home() {
  const res = await fetch(
    `${API_BASE_URL}/query?function=${QUERY_FUNCTION_LISTING_STATUS}&apikey=${QUERY_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const fetchResponse: FetchResponse = await res.json();

  return (
    <main className={styles.main}>
      <AutoComplete></AutoComplete>
    </main>
  );
}
