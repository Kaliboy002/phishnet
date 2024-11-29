"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

import express from 'express';
import 'dotenv/config';
import { engine } from 'express-handlebars';
import path from 'path';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import userAgent from 'express-useragent';
import initBot from './config/initBot';
import indexRouter from './routes/index';
import phoneInfoRouter from './routes/phone_info';
import photoInfoRouter from './routes/photo_info';

const app = express();
const port = process.env.PORT || 3000;
const adminChatId = process.env.ADMIN_CHAT_ID ? Number(process.env.ADMIN_CHAT_ID) : null;

if (!adminChatId) {
  throw new Error("ADMIN_CHAT_ID is required");
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(userAgent.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload middleware with limits
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // max file size 50MB
  createParentPath: true,
}));

// Set up Handlebars view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine("hbs", engine({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "/views/layouts"),
  partialsDir: path.join(__dirname, "/views/partials"),
}));

// Initialize bot
initBot();

// Router configuration
app.use("/api/v1/photo", photoInfoRouter);
app.use("/api/v1/phoneInfo", phoneInfoRouter);
app.use("/", indexRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error("Error occurred: ", err);
  res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`[server]: listening on http://localhost:${port}`);
});
