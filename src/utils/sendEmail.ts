import Mailgun from "mailgun-js";

const mailGunClient = Mailgun({
  apiKey: `${process.env.MAILGUN_API_KEY}`,
  domain: `${process.env.MAILGUN_DOMAIN}`,
});

const sendEmail = (subject: string, html: string) => {
  const emailData: Mailgun.messages.SendData = {
    from: "adslonese@gmail.com",
    to: "adslonese@gmail.com",
    subject,
    html,
  };
  return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello! ${fullName}, please verify your email`;
  const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}/">Here</a>`;
  return sendEmail(emailSubject, emailBody);
};
