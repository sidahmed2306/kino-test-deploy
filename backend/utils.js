const fs = require("fs");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB_NAME || "first-data-09-01-2023";
const GMAIL_ADRESS = process.env.GMAIL_ADRESS;
const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

let dbReference = null;

function sendMail({ to, subject, message, html }) {
  return oAuth2Client
    .getAccessToken()
    .then((accessToken) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: GMAIL_ADRESS,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      return transporter.sendMail({
        from: `kino future test digital <${GMAIL_ADRESS}>`,
        to,
        subject,
        message,
        html: html ? html : message.replaceAll("\n", "<br/>"),
      });
    })
    .then((sentMessageInfo) => {
      console.log("email wurde gesendet");
      return sentMessageInfo.accepted.includes(to); // return true/false
    });
}

function readfile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (data === "") {
          return [];
        }
        const dataObject = JSON.parse(data);
        resolve(dataObject);
      }
    });
  });
}

function writefile(filename, dataObject) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(dataObject, null, 2);
    fs.writeFile(filename, dataString, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(dataObject);
      }
    });
  });
}

function getDB() {
  if (dbReference) {
    return Promise.resolve(dbReference);
  } else {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((connectesClient) => {
        return connectesClient.db(dbName);
      })
      .then((db) => {
        dbReference = db;
        return dbReference;
      });
  }
}

module.exports = {
  readfile,
  writefile,
  sendMail,
  getDB,
};
