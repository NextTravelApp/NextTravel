import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendNotification(
  token: string,
  options: {
    title: string;
    body: string;
    data?: Record<string, string>;
  },
) {
  const message = {
    to: token,
    sound: "default",
    ...options,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export async function sendEmail(email: string, title: string, body: string) {
  if (process.env.EMAIL_HOST)
    return await transporter.sendMail({
      from: '"NextTravel" <team@nexttravel.app>',
      to: email,
      subject: title,
      html: body,
    });

  console.log(`[Notifications] [Email] Sending email to ${email}: ${title}`);
}
