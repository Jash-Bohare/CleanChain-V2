const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendClaimNotification(email, name, locationName) {
  const mailOptions = {
    from: `"CleanChain" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🧹 You’ve Successfully Claimed a Cleanup Spot!",
    html: `
      <h2>Hey ${name || 'Cleaner'}!</h2>
      <p>Thank you for stepping up 🙌</p>
      <p>You’ve successfully claimed the spot: <strong>${locationName}</strong>.</p>
      <p>Now go clean it, upload your proof, and earn those sweet tokens 💰</p>
      <br/>
      <p>— The CleanChain Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendClaimNotification;
