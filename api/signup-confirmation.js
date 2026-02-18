export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Email configuration error' });
  }

  const { email, firstName, userType } = req.body;

  if (!email || !firstName || !userType) {
    return res.status(400).json({ error: 'Email, first name, and user type are required' });
  }

  const emailContent = userType === 'learner'
    ? generateLearnerEmail(firstName)
    : generateMentorEmail(firstName);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'hobski <hello@hobski.com>',
        to: [email],
        subject: `Welcome to hobski, ${firstName}! 🎉`,
        html: emailContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

function generateLearnerEmail(firstName) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to hobski</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #E6F6FF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background-color: #143269; border-radius: 16px 16px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold;">hobski</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #143269; font-size: 28px; font-weight: bold;">Welcome, ${firstName}! 🎉</h2>

                    <p style="margin: 0 0 16px; color: #143269; font-size: 16px; line-height: 1.6;">
                      Thank you for joining hobski as an early learner! We're thrilled to have you on this journey with us.
                    </p>

                    <p style="margin: 0 0 16px; color: #143269; font-size: 16px; line-height: 1.6;">
                      As part of our pilot program, you'll be among the first to:
                    </p>

                    <ul style="margin: 0 0 24px; padding-left: 20px; color: #143269; font-size: 16px; line-height: 1.8;">
                      <li>Connect with experienced mentors in your community</li>
                      <li>Get hands-on guidance for your hobbies and projects</li>
                      <li>Help shape how hobski works for future learners</li>
                    </ul>

                    <p style="margin: 0 0 16px; color: #143269; font-size: 16px; line-height: 1.6;">
                      We'll keep you updated as we prepare to launch. In the meantime, if you have any questions or feedback, feel free to reach out!
                    </p>

                    <p style="margin: 24px 0 0; color: #143269; font-size: 16px; line-height: 1.6; font-weight: 600;">
                      We believe in you!<br>
                      The hobski team
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; text-align: center; color: #666666; font-size: 14px; line-height: 1.6;">
                    <p style="margin: 0;">
                      ℠ 2026 hobski. Building connections, one hobby at a time.
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
}

function generateMentorEmail(firstName) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to hobski</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #E6F6FF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background-color: #143269; border-radius: 16px 16px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold;">hobski</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #143269; font-size: 28px; font-weight: bold;">Welcome, ${firstName}! 🎉</h2>

                    <p style="margin: 0 0 16px; color: #143269; font-size: 16px; line-height: 1.6;">
                      Thank you for joining hobski as an early mentor! We're so excited to have you share your skills and passion with our community.
                    </p>

                    <p style="margin: 0 0 16px; color: #143269; font-size: 16px; line-height: 1.6;">
                      As part of our pilot program, you'll be among the first to:
                    </p>

                    <ul style="margin: 0 0 24px; padding-left: 20px; color: #143269; font-size: 16px; line-height: 1.8;">
                      <li>Connect with curious learners eager to grow</li>
                      <li>Share your expertise and make an impact</li>
                      <li>Help shape how hobski works for future mentors</li>
                    </ul>

                    <p style="margin: 0 0 16px; color: #143269; font-size: 16px; line-height: 1.6;">
                      We'll keep you updated as we prepare to launch. In the meantime, if you have any questions or feedback, we'd love to hear from you!
                    </p>

                    <p style="margin: 24px 0 0; color: #143269; font-size: 16px; line-height: 1.6; font-weight: 600;">
                      You're making it happen!<br>
                      The hobski team
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; text-align: center; color: #666666; font-size: 14px; line-height: 1.6;">
                    <p style="margin: 0;">
                      ℠ 2026 hobski. Building connections, one hobby at a time.
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
}
