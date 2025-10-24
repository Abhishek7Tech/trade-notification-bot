import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function fetchSolPrice(id: string, symbol: string) {
  const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY!;
  const url =
    `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${id}&names=Solana&symbols=${symbol}`;

  const options = {
    method: "GET",
    headers: { "x-cg-demo-api-key": COINGECKO_API_KEY },
    body: undefined,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[id].usd;
  } catch (error) {
    console.log("Error fetching token price", error);
  }
}

export default fetchSolPrice;