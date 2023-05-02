import nodemailer from "nodemailer";
import { google } from "googleapis";
import { oauth2 } from "googleapis/build/src/apis/oauth2";

// Not changing
const GOOGLE_REDIRECT: string = "https://developers.google.com/oauthplayground";

// Not changing
const GOOGLE_ID: string =
  "199704572461-jv6rghgvgv7a60u1fvdc6noe07ldjrcc.apps.googleusercontent.com";

//   Not changing
const GOOGLE_SECRET: string = "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";

// Changing - Get it from google api , use the redirect link to work on that
const GOOGLE_REFRESHTOKEN: string =
  "1//04DDDwiCxBZAfCgYIARAAGAQSNwF-L9IrLXYMKbrNHKZ2rlj90cYg_1pZ6HospnMkruqQQumOjOzo6t2uqEdHOzYdSiDE4iJGKTU";

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });

// Verify each users on the platform:
export const VerifyUserAccount = async (NewUser: any) => {
  try {
    const GetAccessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: "nicsylvia15f@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESHTOKEN,
        accessToken: GetAccessToken,
      },
    });

    const Mailer = {
      from: "nicsylvia15f@gmail.com",
      to: NewUser?.email,
      subject: "VERIFY YOUR ACCOUNT ⚽⚽⚽⚽",
      html: "",
    };

    transporter
      .sendMail(Mailer)
      .then(() => {
        console.log("Verification email sent");
      })
      .catch((err) => {
        console.log("Verification email not sent", err);
      });
  } catch (error) {
    console.log("An error occured in verifying account", error);
  }
};
