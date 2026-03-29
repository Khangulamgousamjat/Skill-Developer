import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;

// ─── BASE SEND FUNCTION ───────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to} | ID: ${result.id}`);
    return result;
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    throw error;
  }
};

// ─── EMAIL 1: STUDENT OTP VERIFICATION ───────────────────
export const sendEmailVerificationOTP = async (to, name, otp) => {
  await sendEmail({
    to,
    subject: 'Verify your account',
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;
                  margin:0 auto;background:#ffffff;border-radius:12px;
                  overflow:hidden;border:1px solid #E2E8F0;">
        <div style="background:#1E3A5F;padding:32px;text-align:center;">
          <h1 style="color:#F4A100;margin:0;font-size:24px;
                     font-family:'Sora',Arial,sans-serif;">
            Gous org
          </h1>
          <p style="color:#CBD5E1;margin:8px 0 0;font-size:14px;">
            Smart Skill & Live Learning Module
          </p>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#0F172A;font-size:20px;margin:0 0 16px;">
            Hello ${name} 👋
          </h2>
          <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 32px;">
            Thanks for registering. Use the OTP below to verify 
            your email address. This code expires in 
            <strong>10 minutes</strong>.
          </p>
          <div style="background:#F1F5F9;border-radius:12px;
                      padding:24px;text-align:center;margin:0 0 32px;">
            <p style="color:#64748B;font-size:13px;
                      margin:0 0 12px;text-transform:uppercase;
                      letter-spacing:2px;">Your OTP Code</p>
            <p style="color:#1E3A5F;font-size:42px;font-weight:800;
                      letter-spacing:12px;margin:0;
                      font-family:'JetBrains Mono',monospace;">
              ${otp}
            </p>
          </div>
          <p style="color:#94A3B8;font-size:13px;margin:0;">
            If you did not register, ignore this email.
          </p>
        </div>
        <div style="background:#F8FAFC;padding:20px 32px;
                    border-top:1px solid #E2E8F0;">
          <p style="color:#94A3B8;font-size:12px;
                    margin:0;text-align:center;">
            © Gous org — Smart Skill & Live Learning Module
          </p>
        </div>
      </div>
    `
  });
};

// ─── EMAIL 2: STAFF REQUEST RECEIVED ─────────────────────
export const sendRequestReceivedEmail = async (to, name, role) => {
  await sendEmail({
    to,
    subject: 'Access request received (Gous org)',
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;
                  margin:0 auto;background:#ffffff;border-radius:12px;
                  overflow:hidden;border:1px solid #E2E8F0;">
        <div style="background:#1E3A5F;padding:32px;text-align:center;">
          <h1 style="color:#F4A100;margin:0;font-size:24px;
                     font-family:'Sora',Arial,sans-serif;">
            Gous org
          </h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#0F172A;font-size:20px;margin:0 0 16px;">
            Request Received ⏳
          </h2>
          <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Hi ${name}, your request for 
            <strong style="color:#1E3A5F;">${role}</strong> access 
            has been submitted successfully.
          </p>
          <div style="background:#FFF7ED;border-left:4px solid #F4A100;
                      border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <p style="color:#92400E;font-size:14px;margin:0;">
              ⏳ Your request is currently <strong>pending review</strong> 
              by the Super Admin. You will receive an email once 
              a decision has been made.
            </p>
          </div>
          <p style="color:#94A3B8;font-size:13px;margin:0;">
            Please do not reply to this email.
          </p>
        </div>
        <div style="background:#F8FAFC;padding:20px 32px;
                    border-top:1px solid #E2E8F0;">
          <p style="color:#94A3B8;font-size:12px;
                    margin:0;text-align:center;">
            © Gous org — Smart Skill & Live Learning Module
          </p>
        </div>
      </div>
    `
  });
};

// ─── EMAIL 3: ACCOUNT APPROVED ────────────────────────────
export const sendAccountApprovedEmail = async (to, name, role, loginUrl) => {
  await sendEmail({
    to,
    subject: '✅ Account Approved - Gous org',
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;
                  margin:0 auto;background:#ffffff;border-radius:12px;
                  overflow:hidden;border:1px solid #E2E8F0;">
        <div style="background:#1E3A5F;padding:32px;text-align:center;">
          <h1 style="color:#F4A100;margin:0;font-size:24px;
                     font-family:'Sora',Arial,sans-serif;">
            Gous org
          </h1>
        </div>
        <div style="padding:40px 32px;">
          <div style="text-align:center;margin:0 0 32px;">
            <div style="display:inline-block;background:#DCFCE7;
                        border-radius:50%;width:64px;height:64px;
                        line-height:64px;font-size:32px;">✅</div>
          </div>
          <h2 style="color:#0F172A;font-size:20px;
                     margin:0 0 16px;text-align:center;">
            Account Approved!
          </h2>
          <p style="color:#64748B;font-size:15px;
                    line-height:1.6;margin:0 0 24px;text-align:center;">
            Hi ${name}, your request for 
            <strong style="color:#1E3A5F;">${role}</strong> access 
            has been approved. You can now login to the platform.
          </p>
          <div style="text-align:center;margin:0 0 32px;">
            <a href="${loginUrl}"
               style="display:inline-block;background:#F4A100;
                      color:#ffffff;text-decoration:none;
                      padding:14px 40px;border-radius:8px;
                      font-weight:600;font-size:16px;">
              Login to Dashboard →
            </a>
          </div>
          <p style="color:#94A3B8;font-size:13px;
                    margin:0;text-align:center;">
            If the button does not work, copy this link: ${loginUrl}
          </p>
        </div>
        <div style="background:#F8FAFC;padding:20px 32px;
                    border-top:1px solid #E2E8F0;">
          <p style="color:#94A3B8;font-size:12px;
                    margin:0;text-align:center;">
            © Gous org — Smart Skill & Live Learning Module
          </p>
        </div>
      </div>
    `
  });
};

// ─── EMAIL 4: ACCOUNT REJECTED ────────────────────────────
export const sendAccountRejectedEmail = async (to, name, role, reason) => {
  await sendEmail({
    to,
    subject: 'Access request not approved (Gous org)',
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;
                  margin:0 auto;background:#ffffff;border-radius:12px;
                  overflow:hidden;border:1px solid #E2E8F0;">
        <div style="background:#1E3A5F;padding:32px;text-align:center;">
          <h1 style="color:#F4A100;margin:0;font-size:24px;
                     font-family:'Sora',Arial,sans-serif;">
            Gous org
          </h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#0F172A;font-size:20px;margin:0 0 16px;">
            Request Not Approved
          </h2>
          <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Hi ${name}, unfortunately your request for 
            <strong>${role}</strong> access was not approved.
          </p>
          <div style="background:#FEF2F2;border-left:4px solid #EF4444;
                      border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <p style="color:#991B1B;font-size:14px;margin:0 0 6px;
                      font-weight:600;">Reason:</p>
            <p style="color:#B91C1C;font-size:14px;margin:0;">
              ${reason || 'No specific reason provided.'}
            </p>
          </div>
          <p style="color:#64748B;font-size:14px;margin:0;">
            If you believe this is a mistake, please contact 
            your Super Admin directly.
          </p>
        </div>
        <div style="background:#F8FAFC;padding:20px 32px;
                    border-top:1px solid #E2E8F0;">
          <p style="color:#94A3B8;font-size:12px;
                    margin:0;text-align:center;">
            © Gous org — Smart Skill & Live Learning Module
          </p>
        </div>
      </div>
    `
  });
};

// ─── EMAIL 5: PASSWORD RESET OTP ──────────────────────────
export const sendPasswordResetOTP = async (to, name, otp) => {
  await sendEmail({
    to,
    subject: 'Reset your password — Gous org',
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;
                  margin:0 auto;background:#ffffff;border-radius:12px;
                  overflow:hidden;border:1px solid #E2E8F0;">
        <div style="background:#1E3A5F;padding:32px;text-align:center;">
          <h1 style="color:#F4A100;margin:0;font-size:24px;
                     font-family:'Sora',Arial,sans-serif;">
            NRC INNOVATE-X
          </h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#0F172A;font-size:20px;margin:0 0 16px;">
            Password Reset Request 🔐
          </h2>
          <p style="color:#64748B;font-size:15px;
                    line-height:1.6;margin:0 0 32px;">
            Hi ${name}, use the OTP below to reset your password. 
            Expires in <strong>10 minutes</strong>.
          </p>
          <div style="background:#F1F5F9;border-radius:12px;
                      padding:24px;text-align:center;margin:0 0 32px;">
            <p style="color:#64748B;font-size:13px;
                      margin:0 0 12px;text-transform:uppercase;
                      letter-spacing:2px;">Reset OTP</p>
            <p style="color:#1E3A5F;font-size:42px;font-weight:800;
                      letter-spacing:12px;margin:0;
                      font-family:'JetBrains Mono',monospace;">
              ${otp}
            </p>
          </div>
          <p style="color:#94A3B8;font-size:13px;margin:0;">
            If you did not request this, ignore this email. 
            Your password will not change.
          </p>
        </div>
        <div style="background:#F8FAFC;padding:20px 32px;
                    border-top:1px solid #E2E8F0;">
          <p style="color:#94A3B8;font-size:12px;
                    margin:0;text-align:center;">
            © Gous org — Smart Skill & Live Learning Module
          </p>
        </div>
      </div>
    `
  });
};

// ─── EMAIL 6: PROJECT DEADLINE REMINDER ───────────────────
export const sendProjectDeadlineReminder = async (to, name, projectTitle, deadline) => {
  await sendEmail({
    to,
    subject: `⚠️ Project deadline tomorrow: ${projectTitle}`,
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;
                  margin:0 auto;background:#ffffff;border-radius:12px;
                  overflow:hidden;border:1px solid #E2E8F0;">
        <div style="background:#1E3A5F;padding:32px;text-align:center;">
          <h1 style="color:#F4A100;margin:0;font-size:24px;
                     font-family:'Sora',Arial,sans-serif;">
            Gous org
          </h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#0F172A;font-size:20px;margin:0 0 16px;">
            Deadline Reminder ⚠️
          </h2>
          <p style="color:#64748B;font-size:15px;
                    line-height:1.6;margin:0 0 24px;">
            Hi ${name}, your project is due tomorrow. 
            Make sure to submit before the deadline.
          </p>
          <div style="background:#FFF7ED;border-radius:12px;
                      padding:20px 24px;margin:0 0 32px;">
            <p style="color:#92400E;font-size:13px;
                      margin:0 0 6px;text-transform:uppercase;
                      letter-spacing:1px;">Project</p>
            <p style="color:#1E3A5F;font-size:18px;
                      font-weight:700;margin:0 0 12px;">
              ${projectTitle}
            </p>
            <p style="color:#92400E;font-size:13px;
                      margin:0 0 4px;">Deadline</p>
            <p style="color:#EF4444;font-size:15px;
                      font-weight:600;margin:0;">
              ${deadline}
            </p>
          </div>
          <p style="color:#94A3B8;font-size:13px;margin:0;">
            Login to your dashboard to submit your project.
          </p>
        </div>
        <div style="background:#F8FAFC;padding:20px 32px;
                    border-top:1px solid #E2E8F0;">
          <p style="color:#94A3B8;font-size:12px;
                    margin:0;text-align:center;">
            © Gous org — Smart Skill & Live Learning Module
          </p>
        </div>
      </div>
    `
  });
};

// ─── EMAIL 7: CERTIFICATE ISSUED ─────────────────────────
export const sendCertificateIssuedEmail = async (to, name, certType, downloadUrl) => {
  await sendEmail({
    to,
    subject: '🏆 Your certificate is ready!',
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;
                  margin:0 auto;background:#ffffff;border-radius:12px;
                  overflow:hidden;border:1px solid #E2E8F0;">
        <div style="background:#1E3A5F;padding:32px;text-align:center;">
          <h1 style="color:#F4A100;margin:0;font-size:24px;
                     font-family:'Sora',Arial,sans-serif;">
            Gous org
          </h1>
        </div>
        <div style="padding:40px 32px;text-align:center;">
          <div style="font-size:56px;margin:0 0 16px;">🏆</div>
          <h2 style="color:#0F172A;font-size:22px;margin:0 0 12px;">
            Congratulations, ${name}!
          </h2>
          <p style="color:#64748B;font-size:15px;
                    line-height:1.6;margin:0 0 32px;">
            Your <strong style="color:#1E3A5F;">${certType}</strong> 
            certificate has been issued. 
            Click below to download it.
          </p>
          <a href="${downloadUrl}"
             style="display:inline-block;background:#F4A100;
                    color:#ffffff;text-decoration:none;
                    padding:14px 40px;border-radius:8px;
                    font-weight:600;font-size:16px;margin:0 0 32px;">
            Download Certificate →
          </a>
          <p style="color:#94A3B8;font-size:13px;margin:0;">
            Share your achievement with the world!
          </p>
        </div>
        <div style="background:#F8FAFC;padding:20px 32px;
                    border-top:1px solid #E2E8F0;">
          <p style="color:#94A3B8;font-size:12px;
                    margin:0;text-align:center;">
            © Gous org — Smart Skill & Live Learning Module
          </p>
        </div>
      </div>
    `
  });
};

// ─── EMAIL 8: LECTURE REMINDER ────────────────────────────
export const sendLectureReminderEmail = async (to, name, lectureTitle, time, link) => {
  await sendEmail({
    to,
    subject: `📅 Lecture starting in 1 hour: ${lectureTitle}`,
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;
                  margin:0 auto;background:#ffffff;border-radius:12px;
                  overflow:hidden;border:1px solid #E2E8F0;">
        <div style="background:#1E3A5F;padding:32px;text-align:center;">
          <h1 style="color:#F4A100;margin:0;font-size:24px;
                     font-family:'Sora',Arial,sans-serif;">
            Gous org
          </h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#0F172A;font-size:20px;margin:0 0 16px;">
            Lecture Starting Soon 📅
          </h2>
          <p style="color:#64748B;font-size:15px;
                    line-height:1.6;margin:0 0 24px;">
            Hi ${name}, your lecture begins in 1 hour. Be ready!
          </p>
          <div style="background:#EFF6FF;border-radius:12px;
                      padding:20px 24px;margin:0 0 32px;">
            <p style="color:#1E40AF;font-size:13px;
                      margin:0 0 6px;text-transform:uppercase;
                      letter-spacing:1px;">Lecture</p>
            <p style="color:#1E3A5F;font-size:18px;
                      font-weight:700;margin:0 0 12px;">
              ${lectureTitle}
            </p>
            <p style="color:#1E40AF;font-size:13px;margin:0 0 4px;">Time</p>
            <p style="color:#1E3A5F;font-size:15px;
                      font-weight:600;margin:0;">
              ${time}
            </p>
          </div>
          <div style="text-align:center;">
            <a href="${link}"
               style="display:inline-block;background:#1E3A5F;
                      color:#ffffff;text-decoration:none;
                      padding:14px 40px;border-radius:8px;
                      font-weight:600;font-size:16px;">
              Join Lecture →
            </a>
          </div>
        </div>
        <div style="background:#F8FAFC;padding:20px 32px;
                    border-top:1px solid #E2E8F0;">
          <p style="color:#94A3B8;font-size:12px;
                    margin:0;text-align:center;">
            © Gous org — Smart Skill & Live Learning Module
          </p>
        </div>
      </div>
    `
  });
};

// ─── EMAIL 9: MONDAY MANAGER DIGEST ───────────────────────
export const sendManagerWeeklyDigest = async (to, managerName, stats) => {
  await sendEmail({
    to,
    subject: `📊 Weekly Team Report — ${stats.weekDate}`,
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;
                  margin:0 auto;background:#ffffff;border-radius:12px;
                  overflow:hidden;border:1px solid #E2E8F0;">
        <div style="background:#1E3A5F;padding:32px;text-align:center;">
          <h1 style="color:#F4A100;margin:0;font-size:24px;
                     font-family:'Sora',Arial,sans-serif;">
            Gous org
          </h1>
          <p style="color:#CBD5E1;margin:8px 0 0;font-size:14px;">
            Weekly Team Report — ${stats.weekDate}
          </p>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#0F172A;font-size:20px;margin:0 0 24px;">
            Hi ${managerName}, here's your team summary 📊
          </h2>
          <table style="width:100%;border-collapse:collapse;
                        margin:0 0 32px;border-radius:8px;
                        overflow:hidden;">
            <tr style="background:#F1F5F9;">
              <td style="padding:12px 16px;color:#64748B;
                         font-size:13px;font-weight:600;">
                Total Interns
              </td>
              <td style="padding:12px 16px;color:#0F172A;
                         font-size:15px;font-weight:700;
                         text-align:right;">
                ${stats.totalInterns}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;color:#64748B;
                         font-size:13px;font-weight:600;">
                Average Team Score
              </td>
              <td style="padding:12px 16px;color:#1E3A5F;
                         font-size:15px;font-weight:700;
                         text-align:right;">
                ${stats.avgScore}%
              </td>
            </tr>
            <tr style="background:#F1F5F9;">
              <td style="padding:12px 16px;color:#64748B;
                         font-size:13px;font-weight:600;">
                Top Performer
              </td>
              <td style="padding:12px 16px;color:#22C55E;
                         font-size:15px;font-weight:700;
                         text-align:right;">
                🏆 ${stats.topPerformer}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;color:#64748B;
                         font-size:13px;font-weight:600;">
                Projects Submitted This Week
              </td>
              <td style="padding:12px 16px;color:#0F172A;
                         font-size:15px;font-weight:700;
                         text-align:right;">
                ${stats.projectsSubmitted}
              </td>
            </tr>
            <tr style="background:#FEF2F2;">
              <td style="padding:12px 16px;color:#991B1B;
                         font-size:13px;font-weight:600;">
                ⚠️ Inactive Interns (3+ days)
              </td>
              <td style="padding:12px 16px;color:#EF4444;
                         font-size:15px;font-weight:700;
                         text-align:right;">
                ${stats.inactiveCount}
              </td>
            </tr>
          </table>
          <p style="color:#94A3B8;font-size:13px;margin:0;">
            Login to your dashboard for full details and 
            to review pending project submissions.
          </p>
        </div>
        <div style="background:#F8FAFC;padding:20px 32px;
                    border-top:1px solid #E2E8F0;">
          <p style="color:#94A3B8;font-size:12px;
                    margin:0;text-align:center;">
            © Gous org — Smart Skill & Live Learning Module
          </p>
        </div>
      </div>
    `
  });
};

export default sendEmail;
