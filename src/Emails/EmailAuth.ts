import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";

// Not changing
const GOOGLE_REDIRECT: string = "https://developers.google.com/oauthplayground";

// Not changing
const GOOGLE_ID: string =
  "367762056277-jtls6icdrtvdrpu29988a4p41cebi5r8.apps.googleusercontent.com";

//   Not changing
const GOOGLE_SECRET: string = "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";

// Changing - Get it from google api , use the redirect link to work on that
const GOOGLE_REFRESHTOKEN: string =
  "1//0438HcdvFoP0YCgYIARAAGAQSNwF-L9IrjgAfqFuy4QQtoyPwsKgJZNuJu4bcQs2dL4sO-MpIMg6kg1cgY-6SgciBT6H1C5pjoF4";

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });

// Verify each users on the platform:

export const veriryAccount = async (createUser: any) => {
  try {
    oAuth.setCredentials({
      access_token: GOOGLE_REFRESHTOKEN,
    });
    const getToken = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "sannifortune11@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESHTOKEN,
        accessToken: getToken?.token!,
      },
    });

    const mailerOptions = {
      from: "Predit Match <sannifortune11gmail.com>",
      to: createUser?.email,
      subject: "Hello",
      text: "Verify your Account",
      html: `<b>OTP: ${createUser?.OTP}</b>`,
    };

    transporter
      .sendMail(mailerOptions)
      .then(() => {
        console.log("Email sent..");
      })
      .catch((err) => {
        console.log("transporter Error", err);
      });
  } catch (error) {
    console.log("An error occured in sending email", error);
  }
};
