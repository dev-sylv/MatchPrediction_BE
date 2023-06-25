import nodemailer from "nodemailer";
import { google } from "googleapis";

// Not changing
const GOOGLE_REDIRECT: string = "https://developers.google.com/oauthplayground";

// Not changing
const GOOGLE_ID: string =
  "24372524741-jn16e1i5tcijldtr4ipcn55rtje4am4j.apps.googleusercontent.com";

//   Not changing
const GOOGLE_SECRET: string = "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";

// Changing - Get it from google api , use the redirect link to work on that
const GOOGLE_REFRESHTOKEN: string =
  "1//04GUtuw7JeuxYCgYIARAAGAQSNwF-L9IroTMvzhkr6oNRxm63Cima8oRzQU4tIsivTj9EPBmDL9qUatQODhDhkP0qbP4qut3HUdE";

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });

// Verify each users on the platform:

export const send_message = async (user: any) => {
  try {
    const getToken: any = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "nicsylvia15f@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESHTOKEN,
        accessToken: getToken?.token!,
      },
    });

    const mailerOptions = {
      from: user?.email,
      to: "nicsylvia15f@gmail.com",
      subject: "user from Match Prediction Platform",
      html: user?.message,
    };

    transporter
      .sendMail(mailerOptions)
      .then(() => {
        console.log("Message sent to Email successfully..");
      })
      .catch((err) => {
        console.log("Email transporter Error: ", err);
      });
  } catch (error) {
    console.log("An error occured in sending email", error);
  }
};
