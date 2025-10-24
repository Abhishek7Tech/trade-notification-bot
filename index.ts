import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bot from "./bot/bot";
import bodyParser = require("body-parser");
import fetchTokenName from "./utils/getTokenNames";
import fetchTokenPrice from "./utils/getTokenPrices";
import fetchSolPrice from "./utils/getNativePrices";
import Trade from "./model/tradeSchema";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3000;
const HELIUS_AUTH_TOKEN = process.env.HELIUS_AUTH_TOKEN!;
const BOT_ID = process.env.BOT_CHAT_ID!;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING!;

const app = express();
app.use(bodyParser.json());

mongoose.connect(DB_CONNECTION_STRING).then(() => {
  console.log("Connected to MongoDB");
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook headers:", req.headers);
    const bearerToken = req.headers["authorization"]?.split(" ")[1];
    console.log("Bearer Token", bearerToken, HELIUS_AUTH_TOKEN);
    if (bearerToken !== HELIUS_AUTH_TOKEN) {
      console.log("Unauthorized webhook request");
      return res.status(401).send("Unauthorized");
    }
    console.log("Body", req.body);
    // Process the payload for Token Transfers
    if (req.body[0].tokenTransfers?.length === 1) {
      const transfers = req.body[0].tokenTransfers[0];
      const from = transfers.fromUserAccount;
      const to = transfers.toUserAccount;
      const mintAddress = transfers.mint;
      const amount = transfers.tokenAmount;

      const tokenName = await fetchTokenName(mintAddress);
      // USDC address
      const tokenPrice = await fetchTokenPrice(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );
      console.log("Token Price", tokenPrice, typeof tokenPrice);
      const price = (tokenPrice * amount).toFixed(3);
      if (tokenName) {
        bot.sendMessage(
          BOT_ID,
          `Token Transfer Detected!\n\nToken: ${amount} ${tokenName.symbol}\n\nFrom: ${from}\n\nTo: ${to}\n\n Amount: ${price} USD`
        );

        const trade = await Trade.create({
          token: `${amount} ${tokenName.symbol}`,
          sender: from,
          receiver: to,
          price: price,
          activity: "sent",
        });

        console.log("Trade saved:", trade);
      }
    }

    // Process the payload for Native Transfers
    if (req.body[0].nativeTransfers?.length === 1) {
      console.log("NATIVE TRANSFER", req.body);
      const transfers = req.body[0].nativeTransfers[0];
      const from = transfers.fromUserAccount;
      const to = transfers.toUserAccount;
      // Divide by LAMPORTS_PER_SOL
      const amount = transfers.amount;
      const solPrice = await fetchSolPrice("solana", "sol");
      const price = (solPrice * (amount / 1e9)).toFixed(3);

      // Send a message via telegram bot
      bot.sendMessage(
        BOT_ID,
        `SOL Transfer Detected!\n\nToken: ${(amount / 1e9).toFixed(
          3
        )} SOL \n\nFrom: ${from}\n\nTo: ${to}\n\n Amount: ${price} USD`
      );
       const trade = await Trade.create({
          token: `${(amount / 1e9).toFixed(3)} SOL`,
          sender: from,
          receiver: to,
          price: price,
          activity: "sent",
        });

        console.log("Trade saved:", trade);
      // Save it in the database
    }

    console.log("Token transfers");
    console.log(
      "Native transfers",
      req.body[0].nativeTransfers,
      req.body[0].nativeTransfers?.length
    );

    return res.status(200).send("Webhook received");
  } catch (error) {
    return res.status(500).send("Error processing webhook");
  }
  // const data = req.body;
  // console.log("Received webhook data:", data);
});

app.get("/", (req, res) => {
  res.send("Hello, The bot is running!");
});
// app.get('/', (req, res) => {

// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   const messageText = msg.text;

//   // Reply to the user with the same message they sent
//   bot.sendMessage(chatId, `You said: ${messageText}`);
// });

console.log("Telegram bot is running...");

// res.send("Hello, The bot is running!");
// })

app.listen(port, () => {
  console.log("Server is running on port", port);
});
