import { schedule } from 'node-cron';
import { UpdateCoinListService } from '../../services';

export const registerUpdateCoinListCron = () => {
  schedule('57 19 1 May,August,November,Febuary *', UpdateCoinListService.updateCoinList);
};
