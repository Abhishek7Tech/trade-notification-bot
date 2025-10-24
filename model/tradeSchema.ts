import { timeStamp } from "console";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const tradesSchema = new Schema({
  timeStamp: { type: Date, default: Date.now },
  token: String,
  sender: String,
  receiver: String,
  price: Number,
  activity: { type: String, enum: ["sent", "received"] },
});

const Trade = model("Trade", tradesSchema);
export default Trade;
