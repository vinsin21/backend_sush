function otpGenerator() {
    let otp = Math.floor(100000 + Math.random() * 9000);
    return otp;
  }
  
module.exports = { otpGenerator};