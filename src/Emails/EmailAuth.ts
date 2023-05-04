import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";

// // Not changing
// const GOOGLE_REDIRECT: string = "https://developers.google.com/oauthplayground";

// // Not changing
// const GOOGLE_ID: string =
//   "199704572461-jv6rghgvgv7a60u1fvdc6noe07ldjrcc.apps.googleusercontent.com";

// //   Not changing
// const GOOGLE_SECRET: string = "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";

// // Changing - Get it from google api , use the redirect link to work on that
// const GOOGLE_REFRESHTOKEN: string =
//   "1//04DDDwiCxBZAfCgYIARAAGAQSNwF-L9IrLXYMKbrNHKZ2rlj90cYg_1pZ6HospnMkruqQQumOjOzo6t2uqEdHOzYdSiDE4iJGKTU";

// const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

// oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });

const GOOGLe_ID =
  "717654860266-4jdicf1esea6bemik2s1duf52dh3tc76.apps.googleusercontent.com";
const GOOGLe_SECRET = "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";
const GOOGLE_REFRESHTOKEN =
  "1//045PXVtNV4Jx4CgYIARAAGAQSNwF-L9IrOj_xB8pIeGiNUFtO3hwbAL-ni7vBD8tVsK6zkYrr-Ewl5Y_Y7agdwCCtbL929hsAQlg";
const REDIRECT = "https://developers.google.com/oauthplayground";

const oAuth = new google.auth.OAuth2(GOOGLe_ID, GOOGLe_SECRET, REDIRECT);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESHTOKEN });

const FrontendURL = "http://localhost:5173/confirm";

// Verify each users on the platform:
export const VerifyUserAccount = async (NewUser: any) => {
  try {
    const GetAccessToken: any = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: "d1churchnetwork@gmail.com",
        clientId: GOOGLe_ID,
        clientSecret: GOOGLe_SECRET,
        refreshToken: GOOGLE_REFRESHTOKEN,
        accessToken: GetAccessToken.token,
      },
    });

    // Connecting the account verification ejs file so users can get the email in that format:
    const LoadVerificationFile = path.join(
      __dirname,
      "../../views/AccountVerification.ejs"
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
