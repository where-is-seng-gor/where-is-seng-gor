import { FetcherError } from "./errors";

async function getText(res: Response) {
  try {
    return (await res.text()) || res.statusText;
  } catch (error) {
    return res.statusText;
  }
}

async function getError(res: Response) {
  if (res.headers.get("Content-Type")?.includes("application/json")) {
    const data = await res.json();
    return new FetcherError({ errors: data.errors, status: res.status });
  }
  return new FetcherError({ message: await getText(res), status: res.status });
}

const fetcher = async ({ url, method = "GET", body: bodyObj }: any) => {
  const hasBody = Boolean(bodyObj);
  const body = hasBody ? JSON.stringify(bodyObj) : undefined;
  const headers = hasBody ? { "Content-Type": "application/json" } : undefined;
  const res = await fetch(url, { method, body, headers });

  if (res.ok) {
    const { data } = await res.json();
    return data;
  }

  throw await getError(res);
};

export default fetcher;