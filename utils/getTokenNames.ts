import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const url = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

async function fetchTokenName(mint: string) {
    const body = {
    jsonrpc: '2.0',
    id: 'helius-metadata',
    method: 'getAsset',
    params: { id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)        
    
    });
    console.log("RESPONSE", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("DATA", data.result.content.metadata);
    console.log("DATA-2", data.result.token_info);

    return data.result.content.metadata;
  } catch (error) {
    console.log("Error fetching token name:", error);
  }
}

export default fetchTokenName;
