const accessDeathDate = Number(process.env.JWT_ACCESS_EXPIRES_IN_SECONDS);
const refreshDeathDate = Number(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS);

if (accessDeathDate === NaN) {
  throw new Error('process.env.JWT_ACCESS_EXPIRES_IN_SECONDS is NaN');
}
if (refreshDeathDate === NaN) {
  throw new Error('process.env.JWT_REFRESH_EXPIRES_IN_SECONDS is NaN');
}
if (!process.env.JWT_SECRET) {
  throw new Error('process.env.JWT_SECRET is undefined');
}

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  accessDeathDate,
  refreshDeathDate,
};