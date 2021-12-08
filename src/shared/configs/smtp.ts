if (!process.env.SMTP_HOST) {
  throw new Error('process.env.SMTP_HOST is undefined');
}
if (!process.env.SMTP_PORT) {
  throw new Error('process.env.SMTP_PORT is undefined');
}
if (!process.env.SMTP_USER) {
  throw new Error('process.env.SMTP_USER is undefined');
}
if (!process.env.SMTP_PASSWORD) {
  throw new Error('process.env.SMTP_PASSWORD is undefined');
}

const port = Number(process.env.SMTP_PORT);

if (port === NaN) {
  throw new Error('process.env.SMTP_PORT is NaN');
}

export const smtpConfig = {
  host: process.env.SMTP_HOST,
  port,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
};
