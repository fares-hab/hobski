// Email utility functions - calls serverless API routes

export async function sendConfirmationEmail(userEmail, firstName, userType) {
  try {
    const response = await fetch('/api/signup-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, firstName, userType })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Confirmation API error:', data);
      return { success: false, error: data.error || 'Failed to send email' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}

export async function sendContactEmail({ firstName, lastName, email, message }) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, message })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Contact API error:', data);
      return { success: false, error: data.error || 'Failed to send email' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}
