import Link from "next/link";
import styles from "./page.module.css";

async function getData() {
  const res = await fetch(
    "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=LQGTNZDO0EKBURNR",
    { cache: "force-cache" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const data = await getData();

  return (
    <main className={styles.main}>
      <input></input>
    </main>
  );
}
