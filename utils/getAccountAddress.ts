import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const HELIUS_WEBHOOK_ID = process.env.HELIUS_WEBHOOK_ID!;

async function getTransactionType(from: string, to: string) {
  const url = `https://api.helius.xyz/v0/webhooks/${HELIUS_WEBHOOK_ID}?api-key=${HELIUS_API_KEY}`;
  const options = { method: "GET", body: undefined };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.accountAddresses) {
      const type = transactionType(data.accountAddresses, from, to);
      return type;
    }
    throw new Error(`HTTP error! status: ${404}`);
  } catch (error) {
    console.error("Error fetching account address:", error);
  }
}

export default getTransactionType;

function transactionType(walletAddress: string[], from: string, to: string) {
  if (walletAddress.includes(from)) {
    return "sent";
  }

  if (walletAddress.includes(to)) {
    return "received";
  }

  return "unknown";
}
