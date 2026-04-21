import { Resend } from "resend";

/**
 * Email Utility
 * Handles sending verification and password reset emails using Resend SDK
 */

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_NAME = "AlgoPrep";
const BRAND_COLOR = "#10b981"; // Emerald-500
const BG_COLOR = "#000000";
const BORDER_COLOR = "#27272a"; // Zinc-800

// Branded sender for the verified domain
const FROM_EMAIL = "AlgoPrep <auth@algoprep.nitishyadav.xyz>";

/**
 * Send Verification Email
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${BG_COLOR}; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid ${BORDER_COLOR}; padding: 40px; }
          .header { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; color: #52525b; margin-bottom: 40px; }
          .title { font-size: 24px; font-weight: bold; letter-spacing: -0.02em; margin-bottom: 20px; }
          .content { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 40px; }
          .btn { display: inline-block; background-color: #ffffff; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 12px; border-radius: 2px; text-transform: uppercase; }
          .footer { margin-top: 60px; font-size: 10px; color: #3f3f46; border-top: 1px solid ${BORDER_COLOR}; padding-top: 20px; }
          .accent { color: ${BRAND_COLOR}; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">${APP_NAME} // SECURITY IDENTITY PROTOCOL</div>
          <h1 class="title">Verify your <span class="accent">identity</span></h1>
          <div class="content">
            Confirm your email address to activate your algorithmic laboratory. 
            Verification is required to execute code and participate in the roadmap.
          </div>
          <a href="${verificationUrl}" class="btn">Verify Account</a>
          <div class="footer">
            If you did not create an account on ${APP_NAME}, please ignore this email.<br>
            Verification link expires in 24 hours.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `[ACTION REQUIRED] Verify your ${APP_NAME} Identity`,
      html,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (err) {
    console.error("❌ Email Utility Error:", err);
    throw err;
  }
};

/**
 * Send Password Reset Email
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${BG_COLOR}; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid ${BORDER_COLOR}; padding: 40px; }
          .header { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; color: #52525b; margin-bottom: 40px; }
          .title { font-size: 24px; font-weight: bold; letter-spacing: -0.02em; margin-bottom: 20px; }
          .content { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 40px; }
          .btn { display: inline-block; background-color: #ffffff; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 12px; border-radius: 2px; text-transform: uppercase; }
          .footer { margin-top: 60px; font-size: 10px; color: #3f3f46; border-top: 1px solid ${BORDER_COLOR}; padding-top: 20px; }
          .accent { color: #f43f5e; } /* Rose-500 for recovery */
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">${APP_NAME} // RECOVERY PROTOCOL</div>
          <h1 class="title">Reset your <span class="accent">passkey</span></h1>
          <div class="content">
            A password reset was requested for your engineer account. 
            Access this link to initialize your new credentials.
          </div>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <div class="footer">
            If you did not request a password reset, please contact security immediately.<br>
            Recovery link expires in 1 hour.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `[RECOVERY] Password Reset Requested`,
      html,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      throw new Error("Failed to send password reset email");
    }

    return data;
  } catch (err) {
    console.error("❌ Email Utility Error:", err);
    throw err;
  }
};
