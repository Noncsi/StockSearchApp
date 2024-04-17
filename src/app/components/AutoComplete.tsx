"use client";
import React, { Fragment, useEffect, useState } from "react";
import Papa from "papaparse";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { ROUTE_DETAIL } from "../constants";
import { Stock } from "../customTypes";

export async function* streamingFetch(input: RequestInfo | URL) {
  const response = await fetch(input);
  const reader =
    response?.body?.getReader() as ReadableStreamDefaultReader<Uint8Array>;
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    try {
      yield decoder.decode(value);
    } catch (error: any) {
      console.warn(error.message);
    }
  }
}

export default function AutoComplete() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredItems, setFilteredItems] = useState<Stock[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const stream = streamingFetch("/api");
      for await (let value of stream) {
        try {
          const parsedData = Papa.parse(value, { header: true });
          setStocks(parsedData.data as Stock[]);
        } catch (error: any) {
          console.warn(error.message);
        }
      }
    };

    fetchData();
  }, []);

  const comboBoxOnChangeHandler = (input: string) => {
    if (input === "") {
      setFilteredItems([]);
      return;
    }

    const filteredStocks = stocks
      .filter((item) =>
        [item.symbol, item.name].some((prop) =>
          prop?.toLowerCase().includes(input.toLowerCase())
        )
      )
      .slice(0, 100); // return only first 100 for faster rendering

    setFilteredItems(filteredStocks);
  };

  const navigateToDetail = (symbol: string) => {
    router.push(`${ROUTE_DETAIL}/${symbol}`);
  };

  return (
    <div className="fixed top-16 w-72">
      <Combobox>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => comboBoxOnChangeHandler(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredItems.length === 0 ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredItems.map((stock: Stock) => (
                  <Combobox.Option
                    onClick={() => navigateToDetail(stock.symbol)}
                    key={stock.symbol}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={stock.symbol}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {stock.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
