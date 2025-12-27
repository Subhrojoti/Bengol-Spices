import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOtpMail = async (email, otp) => {
  try {
    // Create mail transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // sender email
        pass: process.env.MAIL_PASS, // app password
      },
    });

    // Email configuration
    const mailOptions = {
      from: `"Bengol Spices Limited" <${process.env.MAIL_USER}>`,
      to: email, // receiver email
      subject: "Your OTP Code",
      html: `
  <div style="background-color:#f4f6f8;padding:30px 0;">
    <div style="max-width:520px;margin:auto;background:#ffffff;
                border-radius:10px;overflow:hidden;
                box-shadow:0 4px 12px rgba(0,0,0,0.08);
                font-family:Arial, sans-serif;">

      <!-- Header -->
      <div style="background:#0f9d58;padding:20px;text-align:center;color:#ffffff;">
        <h2 style="margin:0;">Bengol Spices</h2>
        <p style="margin:5px 0 0;font-size:14px;">Secure OTP Verification</p>
      </div>

      <!-- Body -->
      <div style="padding:30px;color:#333333;">
        <p style="font-size:15px;margin-bottom:10px;">
          Hello,
        </p>

        <p style="font-size:15px;line-height:1.6;">
          Use the following One-Time Password (OTP) to complete your verification:
        </p>

        <!-- OTP Box -->
        <div style="text-align:center;margin:25px 0;">
          <span style="
            display:inline-block;
            padding:15px 30px;
            font-size:28px;
            letter-spacing:6px;
            font-weight:bold;
            color:#0f9d58;
            background:#f1fdf6;
            border:2px dashed #0f9d58;
            border-radius:8px;">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px;color:#555;">
          ⏳ This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="font-size:14px;color:#555;line-height:1.6;">
          If you didn’t request this OTP, please ignore this email.  
          Your account is safe.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#fafafa;padding:15px;text-align:center;
                  font-size:12px;color:#888;">
        © ${new Date().getFullYear()} Bengol Spices Limited  
        <br/>
        This is an automated message. Please do not reply.
      </div>

    </div>
  </div>
`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw new Error("Failed to send OTP email");
  }
};
