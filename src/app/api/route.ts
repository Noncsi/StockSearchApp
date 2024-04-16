import {
  API_BASE_URL,
  QUERY_FUNCTION_LISTING_STATUS,
  QUERY_API_KEY,
} from "../constants";

export async function GET() {
  const csvFile = `${API_BASE_URL}/query?function=${QUERY_FUNCTION_LISTING_STATUS}&apikey=${QUERY_API_KEY}`;

  const stream = (await fetch(csvFile)).body;
  const response = new StreamingResponse(stream as any);
  return response;
}

class StreamingResponse extends Response {
  constructor(res: ReadableStream<any>, init?: ResponseInit) {
    super(res as any, {
      ...init,
      status: 200,
      headers: {
        ...init?.headers,
      },
    });
  }
}
