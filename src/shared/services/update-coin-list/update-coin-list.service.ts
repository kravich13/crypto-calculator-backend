import got from 'got/dist/source';
import { ICoinsMarketsResponse } from '../../coin-gecko';
import { coinGeckoConfig } from '../../configs';
import { CoinListEntity, MongoManager } from '../../database';
import { LoggerInstance } from '../logger';

export const updateCoinList = () => {
  const PER_PAGE = 250;
  let page = -1;

  const intervalId = setInterval(async () => {
    try {
      ++page;

      const data = (await got(
        `${coinGeckoConfig.url}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${PER_PAGE}&page=${page}&sparkline=false`
      ).json()) as ICoinsMarketsResponse[];

      if (data.length === 0) {
        clearInterval(intervalId);
        return;
      }

      for (const { id, name, symbol, image, atl_date } of data) {
        await MongoManager.updateOne(
          CoinListEntity,
          { id },
          { $setOnInsert: { coinId: id, name, symbol, image, atl_date: new Date(atl_date) } },
          { upsert: true }
        );
      }

      LoggerInstance.info(`Update coin list result: ${data.length} coins, ${page} page.`);
    } catch (err) {
      LoggerInstance.error('Update coin list error');
    }
  }, 60 * 1_000);
};
