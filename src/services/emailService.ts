import sgMail from "@sendgrid/mail";
import { config } from "../config";

export const sendEmail = async (
  to: string,
  token: string = "Success",
  html?: string
) => {
  try {
    const defaultHtml = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;">
        <table role="presentation" style="width: 100%; padding: 20px; background-color: #ffffff;">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <h2>Password Reset Request</h2>
              <p style="font-size: 16px;">
                You are receiving this email because you (or someone else) have requested to reset your password.
              </p>
              <p style="font-size: 16px;">
                Please click the following link to reset your password:
              </p>
              <a 
                href="${config.WEBSITE_URL}/reset-password/${token}" 
                style="background-color: #4CAF50; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px;">
                Reset Your Password
              </a>
              <p style="font-size: 16px; margin-top: 20px;">
                If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
    sgMail.setApiKey(config.SENDGRID_API_KEY || "");

    const msg = {
      to,
      from: config.SENDER_EMAIL || "your-email@example.com",
      subject: "Password Reset Request",
      text: `You are receiving this email because you (or someone else) have requested to reset your password.     
      Please click the following link to reset your password:
    ${config.WEBSITE_URL}/reset-password/${token}
      
      If you did not request this, please ignore this email.`,
      html: defaultHtml,
    };

    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error: any) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("SendGrid Error Response:", error.response.body);
    }
    throw error;
  }
};
