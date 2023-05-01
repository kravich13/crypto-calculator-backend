import { schedule } from 'node-cron';
import { UpdateCoinListService } from '../../services';
import { cronUpdateCoinListConfig } from '../../configs';

const { minutes, hours, dayOfMonth, monthNames } = cronUpdateCoinListConfig;

export const registerUpdateCoinListCron = () => {
  schedule(
    `${minutes} ${hours} ${dayOfMonth} ${monthNames} *`,
    UpdateCoinListService.updateCoinList
  );
};
