export const passwordResetTemplate = (link: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password – RecruitIQ</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  font-family: 'Segoe UI', system-ui, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
          max-width: 520px;
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        ">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="
                    background: #4f46e5;
                    border-radius: 10px;
                    width: 42px;
                    height: 42px;
                    text-align: center;
                    vertical-align: middle;
                  ">
                    <span style="
                      color: #ffffff;
                      font-size: 22px;
                      font-weight: 800;
                      line-height: 42px;
                    ">R</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <span style="
                      font-size: 24px;
                      font-weight: 700;
                      color: #1e2937;
                    ">RecruitIQ</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">

              <!-- Icon -->
              <div style="
                margin: 0 auto 24px;
                width: 64px;
                height: 64px;
                background: #f0f0ff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
              ">
                🔑
              </div>

              <!-- Headline -->
              <h1 style="
                margin: 0 0 16px 0;
                font-size: 26px;
                font-weight: 700;
                color: #1e2937;
                line-height: 1.2;
              ">Reset your password</h1>

              <p style="
                margin: 0 0 32px 0;
                font-size: 16px;
                color: #64748b;
                line-height: 1.6;
              ">
                We received a request to reset the password for your RecruitIQ account.<br>
                Click the button below to set a new password.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom: 32px;">
                <tr>
                  <td style="background: #4f46e5; border-radius: 12px;">
                    <a href="${link}" style="
                      display: inline-block;
                      padding: 16px 40px;
                      font-size: 16px;
                      font-weight: 600;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 12px;
                    ">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 16px;
                    text-align: left;
                  ">
                    <p style="
                      margin: 0 0 8px 0;
                      font-size: 13px;
                      font-weight: 600;
                      color: #64748b;
                    ">If the button doesn't work, copy this link:</p>
                    <p style="
                      margin: 0;
                      font-size: 14px;
                      color: #4f46e5;
                      word-break: break-all;
                      line-height: 1.5;
                    ">${link}</p>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <p style="
                margin: 0 0 32px 0;
                font-size: 14px;
                color: #ef4444;
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 8px;
                padding: 14px 18px;
                text-align: left;
                line-height: 1.5;
              ">
                If you didn’t request a password reset, please ignore this email or contact support immediately.
              </p>

              <p style="
                margin: 0;
                font-size: 14px;
                color: #64748b;
                line-height: 1.6;
              ">
                This link expires in <strong>10 minutes</strong> and can only be used once.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background: #f8fafc;
              border-top: 1px solid #e2e8f0;
              padding: 24px 40px;
              text-align: center;
            ">
              <p style="
                margin: 0;
                font-size: 13px;
                color: #94a3b8;
              ">
                © ${new Date().getFullYear()} RecruitIQ. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;