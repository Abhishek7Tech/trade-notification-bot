import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Hello, The bot is running!");
})

app.listen(port, () => {
    console.log("Server is running on port", port);
})