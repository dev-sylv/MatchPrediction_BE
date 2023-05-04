import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";

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

const FrontendURL = "http://localhost:5173/confirm";

// Verify each users on the platform:
export const VerifyUserAccount = async (NewUser: any) => {
  try {
    const GetAccessToken: any = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: "nicsylvia15f@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESHTOKEN,
        accessToken: GetAccessToken.token,
      },
    });

    // Connecting the account verification ejs file so users can get the email in that format:
    const LoadVerificationFile = path.join(
      __dirname,
      "../../views/ResetPassword.ejs"
    );

    //Use the ejs method to read the account verification ejs file
    const ReadVerificationData = await ejs.renderFile(LoadVerificationFile, {
      UserName: NewUser?.name,
      UserEmail: NewUser?.email,
      UserId: NewUser?._id,
      UserToken: NewUser?.token,
      UserOTP: NewUser?.OTP,
      Url: `${FrontendURL}/${NewUser?._id}/${NewUser?.token}`,
    });

    const Mailer = {
      from: "Dev Sylvia ❤❤ <nicsylvia15f@gmail.com>",
      to: NewUser?.email,
      subject: "VERIFY YOUR ACCOUNT ⚽⚽⚽⚽",
      html: ReadVerificationData,
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
