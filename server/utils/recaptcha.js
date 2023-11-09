const axios = require('axios');

async function verifyRecaptcha(recaptchaValue) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaValue}`;
  
    try {
      const response = await axios.post(verificationUrl);
      const result = response.data;
      console.log('recaptcha result', result);
      return result.success;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
}

module.exports = {
  verifyRecaptcha,
};