import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';

dotenv.config({path: './.env'});
const token = process.env.TELEGRAM_BOT_TOKEN!;

console.log("Bot Token:", token);

const bot = new TelegramBot(token, { polling: true });

export default bot;
