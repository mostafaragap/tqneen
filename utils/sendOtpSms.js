const axios = require("axios");

const sendOtpEgSms = async (otp = "1234", phone) => {
  try {
    const message = `رمز تفعيل تقنين الخاص بكم هو ${otp}`

    const uri = `https://smssmartegypt.com/sms/api/?username=${process.env.SMSUSERNAME}&password=${process.env.SMSPASSWORD}&sendername=Tqneen&mobiles=${phone}&message=${message}`;
    url = decodeURI(uri);
    url = encodeURI(url);
    const resp = await axios.get(url);
    if (!(resp.data.type == 'error' && resp.data.error.number == 300)) {
      return true
    }
    else {
      return false
    }

  } catch (error) {
    console.log(`sendOtpEgSms, Exception: ${error.message}`);
    return { sent: false, status: -1, error };
  }
}

module.exports = { sendOtpEgSms }