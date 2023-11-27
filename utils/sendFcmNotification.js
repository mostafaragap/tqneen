const axios = require('axios');

function sendFcmNotification(token, notification, dataPayload) {
  const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';
  const serverKey = process.env.FCMKEY; // Replace with your Firebase project's server key
  const message = {
    to: token,
    notification,
    data: dataPayload, // Optional data payload
  };

  const headers = {
    'Authorization': `key=${serverKey}`,
    'Content-Type': 'application/json',
  };

  return axios.post(fcmEndpoint, message, { headers })
    .then((response) => {
      // console.log('Successfully sent FCM message:', response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Error sending FCM message:', error);
    });
}

module.exports = { sendFcmNotification }