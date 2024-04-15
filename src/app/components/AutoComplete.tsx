"use client";
import React, { useState } from "react";
import { ROUTE_DETAIL } from "../constants";
import Link from "next/link";
import { Combobox } from "@headlessui/react";

export default function AutoComplete({
  params: { listItems },
}: {
  params: { listItems: string[] };
}) {
  const [selectedItem, setSelectedItem] = useState("");
  const [query, setQuery] = useState("");

  // const symbols = ["AMZN", "IBM", "MCD", "CSCO", "CAT"];

  const filteredItems =
    query === ""
      ? listItems
      : listItems.filter((item) => {
          return item.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <Combobox value={selectedItem} onChange={setSelectedItem}>
        <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
        <Combobox.Options>
          {filteredItems.map((item) => (
            <Combobox.Option key={item} value={item}>
              {item}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
      <Link href={`${ROUTE_DETAIL}/${selectedItem}`}>get stock prices</Link>
    </>
  );
}
