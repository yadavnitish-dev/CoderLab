import { Resend } from "resend";

/**
 * Resend Client Instance
 * Initialized lazily to prevent startup crashes if the API key is missing.
 */
let resendInstance: Resend | null = null;

const getResendClient = () => {
  if (resendInstance) return resendInstance;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_123456789") {
    console.warn("⚠️ [SECURITY] RESEND_API_KEY is missing or using default. Email protocols are disabled.");
    return null;
  }

  resendInstance = new Resend(apiKey);
  return resendInstance;
};

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
          <div class="header">${APP_NAME} // Account Verification</div>
          <h1 class="title">Verify your <span class="accent">email</span></h1>
          <div class="content">
            Please confirm your email address to complete your account setup. 
            Verification is required to execute code and access the full roadmap.
          </div>
          <a href="${verificationUrl}" class="btn">Verify Email Address</a>
          <div class="footer">
            If you did not create an account on ${APP_NAME}, please ignore this email.<br>
            This link will expire in 24 hours.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const resend = getResendClient();
    if (!resend) {
      console.error("❌ Identity Protocol Error: Resend client not initialized. verification-link-not-sent");
      return null;
    }

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
          <div class="header">${APP_NAME} // Password Recovery</div>
          <h1 class="title">Reset your <span class="accent">password</span></h1>
          <div class="content">
            A password reset was requested for your account. 
            Use the link below to set up your new credentials.
          </div>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <div class="footer">
            If you did not request a password reset, please ignore this email.<br>
            This link will expire in 1 hour.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const resend = getResendClient();
    if (!resend) {
      console.error("❌ Recovery Protocol Error: Resend client not initialized. reset-link-not-sent");
      return null;
    }

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
