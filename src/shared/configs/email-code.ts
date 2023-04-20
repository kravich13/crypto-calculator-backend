const lifetimeExpiresIn = Number(process.env.EMAIL_CODE_LIFETIME_EXPIRES_IN_SECONDS);
const resendExpiresIn = Number(process.env.EMAIL_CODE_RESEND_EXPIRES_IN_SECONDS);

if (Number.isNaN(lifetimeExpiresIn)) {
  throw new Error('process.env.EMAIL_CODE_LIFETIME_EXPIRES_IN_SECONDS is NaN');
}

if (Number.isNaN(resendExpiresIn)) {
  throw new Error('process.env.EMAIL_CODE_RESEND_EXPIRES_IN_SECONDS is NaN');
}

export const emailConfig = {
  lifetimeExpiresIn,
  resendExpiresIn,
};
