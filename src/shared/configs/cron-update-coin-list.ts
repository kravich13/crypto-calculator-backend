const minutes = Number(process.env.CRON_UPDATE_LIST_MINUTES);
const hours = Number(process.env.CRON_UPDATE_LIST_HOURS);
const dayOfMonth = Number(process.env.CRON_UPDATE_LIST_DAY_OF_MONTH);
const monthNames = process.env.CRON_UPDATE_LIST_MONTH_NAMES;
const invervalInSeconds = Number(process.env.CRON_UPDATE_LIST_INVERVAL_IN_SECONDS);

if (Number.isNaN(minutes)) {
  throw new Error('process.env.CRON_UPDATE_LIST_MINUTES is NaN');
}

if (Number.isNaN(hours)) {
  throw new Error('process.env.CRON_UPDATE_LIST_HOURS is NaN');
}

if (Number.isNaN(dayOfMonth)) {
  throw new Error('process.env.CRON_UPDATE_LIST_DAY_OF_MONTH is NaN');
}

if (!monthNames) {
  throw new Error('process.env.CRON_UPDATE_LIST_MONTH_NAMES is undefined');
}

if (Number.isNaN(invervalInSeconds)) {
  throw new Error('process.env.CRON_UPDATE_LIST_INVERVAL_IN_SECONDS is NaN');
}

export const cronUpdateCoinListConfig = {
  minutes,
  hours,
  dayOfMonth,
  monthNames,
  invervalInSeconds,
};
