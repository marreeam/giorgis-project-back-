require('dotenv').config();
import('node-fetch').default;

const apiKey = process.env.MAILERLITE_API_KEY;
const groupId = 126751057704388326; // Replace with your actual group ID

const addSubscriber = async (email, token) => {
  try {
    const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: email,
        fields: {
          verification_token: token,
        },
        resubscribe: true,
        groups: [groupId],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error adding subscriber: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

const sendCampaign = async (email, token) => {
  try {
    const response = await fetch('https://api.mailerlite.com/api/v2/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        subject: 'Verify your email address',
        from: {
          email: 'mariamargalitadze9@gmail.com',
          name: 'historyBetter',
        },
        groups: [groupId],
        content: {
          html: `Please verify your email by clicking on the following link: <a href="http://your-domain.com/verify/${token}">Verify Email</a>`,
          plain: `Please verify your email by clicking on the following link: http://your-domain.com/verify/${token}`,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error sending campaign: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

// Test the functions
(async () => {
  const testEmail = 'test@example.com'; // Replace with your test email
  const testToken = 'sample_token'; // Replace with your test token

  console.log(`Adding subscriber: ${testEmail}`);
  await addSubscriber(testEmail, testToken);

  console.log(`Sending campaign to: ${testEmail}`);
  await sendCampaign(testEmail, testToken);
})();
