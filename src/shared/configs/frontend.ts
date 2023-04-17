if (!process.env.FRONTEND_URL) {
  throw new Error('process.env.FRONTEND_URL is undefined');
}

export const frontendConfig = {
  url: process.env.FRONTEND_URL,
};
