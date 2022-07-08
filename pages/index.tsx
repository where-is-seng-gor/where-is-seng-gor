import type { NextPage } from "next";
import Head from "next/head";
import useSWR from "swr";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import NumberFormat from "react-number-format";
import { NextSeo } from "next-seo";
import fetcher from "../lib/fetcher";

const Home: NextPage = () => {
  const { data, error } = useSWR({ url: "/api/get-data" }, fetcher, {
    refreshInterval: 1500,
    dedupingInterval: 1000,
  });

  const [characters, setCharacters] = useState<any>(null);
  const input = useRef<any>({});

  useEffect(() => {
    if (data?.characters) {
      if (!characters) {
        setCharacters([...data.characters]);
      } else {
        const max1 = Math.max(
          ...characters.map((c: any) =>
            Math.max(
              new Date(c.updatedAt).getTime(),
              ...c.attributes.map((a: any) => new Date(a.updatedAt).getTime())
            )
          )
        );
        const max2 = Math.max(
          ...data.characters.map((c: any) =>
            Math.max(
              new Date(c.updatedAt).getTime(),
              ...c.attributes.map((a: any) => new Date(a.updatedAt).getTime())
            )
          )
        );
        if (max2 > max1) {
          console.log({ max2, max1 });
          setCharacters([...data.characters]);
        }
      }
    }
  }, [data]);

  const debouncedUpdate = useMemo(
    () =>
      debounce(async () => {
        try {
          const keys = Object.keys(input.current);
          if (!keys.length) return;
          const body = keys.map((key) => {
            return { id: parseInt(key), increment: input.current[key] };
          });
          input.current = {};

          await fetch(`/api/increment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }).then((res) => res.json());
        } catch (error) {
          console.log(error);
        }
      }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  return (
    <>
      <NextSeo
        title="賀爸爸去哪兒?!"
        description="一家大細陪住你。有賀爸爸、好姨醫生、奇異局長和撩鼻佬們"
        canonical="https://where-is-seng-gor.vercel.app"
        openGraph={{
          url: "https://where-is-seng-gor.vercel.app",
          title: "賀爸爸去哪兒?!",
          description: "一家大細陪住你。有賀爸爸、好姨醫生、奇異局長和撩鼻佬們",
          images: [
            {
              url: "https://where-is-seng-gor.vercel.app/og-image1.jpg",
              width: 1200,
              height: 630,
              alt: "賀爸爸去哪兒?!",
              type: "image/jpeg",
            },
          ],
          site_name: "賀爸爸去哪兒?!",
        }}
      />
      <div className="flex min-h-screen flex-col items-center justify-center py-10 bg-red-500">
        <Head>
          <title>賀爸爸去哪兒?!</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-center text-white">
            賀爸爸去哪兒?!
          </h1>

          <p className="mt-3 rounded-md bg-red-600 p-3 font-mono text-lg text-red-200">
            幫幫手，唔知佢去左邊，有點担心。
          </p>

          <div className="mt-6 mb-12 grid grid-cols-1 sm:gap-4 lg:grid-cols-2 w-full sm:px-6 lg:max-w-5xl">
            {!!characters &&
              characters.map((c: any) => {
                const arr = c.attributes.map((attr: any) => attr.count);
                const sum = arr.reduce((a: any, b: any) => a + b, 0);
                return (
                  <div
                    key={c.id}
                    className="shadow sm:rounded-xl border p-2 py-4 sm:p-6 text-left bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold">{c.name}</h3>
                      <p className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {
                          <NumberFormat
                            value={sum}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        }
                      </p>
                    </div>
                    <p className="mt-4 text-xl">{c.say}</p>
                    <div className="mt-2 flex flex-wrap">
                      {c.attributes.map((attr: any) => {
                        return (
                          <button
                            key={attr.id}
                            className="mb-2 mr-2 inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm leading-4 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => {
                              setCharacters((prevState: any) => {
                                const newState = prevState.map((char: any) => {
                                  if (char.id === c.id) {
                                    const attributes = char.attributes.map(
                                      (item: any) => {
                                        if (item.id === attr.id) {
                                          return {
                                            ...item,
                                            count: item.count + 1,
                                          };
                                        }
                                        return item;
                                      }
                                    );
                                    return { ...char, attributes };
                                  }
                                  return char;
                                });

                                return newState;
                              });

                              input.current[attr.id] =
                                input.current[attr.id] || 0;
                              input.current[attr.id] += 1;

                              debouncedUpdate();
                            }}
                          >
                            <span className="mr-2 text-2xl">{attr.emoji}</span>
                            <span className="font-medium">{attr.name}</span>
                            <span className="ml-1 text-gray-500">
                              (
                              <NumberFormat
                                value={attr.count}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                              )
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </main>

        <footer className="flex h-24 w-full items-center justify-center border-t border-t-red-200">
          <p className="flex items-center justify-center gap-2 text-red-200">
            Powered by 賀爸爸復仇者聯盟
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;
