import express from 'express';
import dotenv from 'dotenv';
import bot from './bot/bot';
import bodyParser = require('body-parser');

dotenv.config({path: './.env'});
const port = process.env.PORT || 3000;
const HELIUS_AUTH_TOKEN = process.env.HELIUS_AUTH_TOKEN!;

const app = express();
app.use(bodyParser.json());
app.post("/webhook", (req, res) => {
    try {
        console.log("Webhook headers:", req.headers);
        const bearerToken = req.headers['authorization']?.split(' ')[1];
        console.log("Bearer Token", bearerToken, HELIUS_AUTH_TOKEN);
        if(bearerToken !== HELIUS_AUTH_TOKEN) {
            console.log("Unauthorized webhook request");
            return res.status(401).send("Unauthorized");
        }
        console.log("Body", req.body); 
        return res.status(200).send("Webhook received");
    } catch (error) {
       return res.status(500).send("Error processing webhook");
    }
    // const data = req.body;
    // console.log("Received webhook data:", data);
});

app.get('/', (req, res) => {
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
})