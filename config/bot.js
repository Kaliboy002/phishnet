"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const token = process.env.7964758764:AAGuYr8voir-lrOBUim_mj1w2KfY1-7rsgI;
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
module.exports = bot;
