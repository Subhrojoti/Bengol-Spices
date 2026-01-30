import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAdminNotification = async ({
  customAgentId,
  name,
  email,
  phone,
}) => {
  await transporter.sendMail({
    from: `"Bengol Spices" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🚀 New Marketing Agent Application",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

          <div style="background: #1f2937; color: #ffffff; padding: 16px 20px;">
            <h2 style="margin: 0;">New Marketing Agent Applied</h2>
          </div>

          <div style="padding: 20px; color: #333;">
            <p style="font-size: 15px;">
              A new marketing agent has submitted an application. Below are the details:
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Agent ID</td>
                <td style="padding: 8px;">${customAgentId}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 8px; font-weight: bold;">Name</td>
                <td style="padding: 8px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Email</td>
                <td style="padding: 8px;">${email}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 8px; font-weight: bold;">Phone</td>
                <td style="padding: 8px;">${phone}</td>
              </tr>
            </table>

            <div style="margin-top: 25px; text-align: center;">
              <a
                href="#"
                style="
                  background: #2563eb;
                  color: #ffffff;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: bold;
                  display: inline-block;
                "
              >
                Login to Admin Panel
              </a>
            </div>
          </div>

          <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
            © ${new Date().getFullYear()} Bengol Spices Pvt Ltd
          </div>

        </div>
      </div>
    `,
  });
};

export const sendAgentApprovalMail = async ({ email, agentId, token }) => {
  const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Agent Account is Approved",
    text: `
Congratulations!

Your documents are verified successfully.

Agent ID: ${agentId}

Set your password using the link below:
${link}

This link will expire in 15 minutes.
`,
  });
};

// SEND REJECTION EMAIL TO AGENT
export const sendAgentRejectionMail = async ({ email, agentId }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Marketing Agent Application Status",
    text: `
Hello,

We regret to inform you that your marketing agent application has been rejected after verification.

If you believe this is a mistake, you may contact our support team.

Thank you for your interest.

Regards,
Bengol Spices Team
`,
  });
};

export const sendEmployeeWelcomeMail = async ({ name, email, employeeId }) => {
  try {
    const mailOptions = {
      from: `"Bengol Spices" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Bengol Spices – Employee Access Details",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome to Bengol Spices 👋</h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>
            You have been successfully added as an <strong>Employee</strong> at
            <strong>Bengol Spices</strong>.
          </p>

          <p><strong>Your Employee ID:</strong></p>
          <h3 style="color: #2c3e50;">${employeeId}</h3>

          <p>
            This <strong>Employee ID</strong> will be used to log in to the system.
          </p>

          <p style="color: #c0392b;">
            🔒 <strong>Password Information:</strong><br/>
            Your password is currently managed by the <strong>Admin</strong>.
            Please contact the admin directly to obtain your login password.
          </p>

          <p>
            For security reasons, do not share your login credentials with anyone.
          </p>

          <br/>
          <p>Regards,</p>
          <p><strong>Bengol Spices Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Employee welcome email sent to:", email);
  } catch (error) {
    console.error("SEND EMPLOYEE EMAIL ERROR:", error);
    // ❗ Email failure should NOT block employee creation
  }
};
