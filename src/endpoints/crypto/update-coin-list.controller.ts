import Agenda from 'agenda';
import got from 'got';
import { ICoinsMarketsResponse } from '../../shared/coin-gecko';
import { coinGeckoConfig } from '../../shared/configs';
import { CoinListEntity, MongoManager } from '../../shared/database';
import { ControllerOptions } from '../../shared/types';
import { statusOutputSuccess } from '../../shared/view-models';
import { IUpdateCoinListQueryInput, UpdateCoinListSchema } from './schemas';
import { MongoEntityManager } from 'typeorm';

const agenda = new Agenda({ processEvery: '30 seconds' });

agenda.define('update coin list', () => {
  console.log('tut');
});

(async () => {
  await agenda.start();
  // await agenda.every('3 minutes', 'update coin list');
})();

export const updateCoinListController: ControllerOptions<{
  Querystring: IUpdateCoinListQueryInput;
}> = {
  url: '/coin-list/update',
  method: 'POST',
  schema: UpdateCoinListSchema,
  handler: async (req, reply) => {
    const { page, per_page } = req.query;

    const data = (await got(
      `${coinGeckoConfig.url}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=false`
    ).json()) as ICoinsMarketsResponse[];

    for (const { id, name, symbol, image, atl_date } of data) {
      await MongoManager.updateOne(
        CoinListEntity,
        { id },
        { $setOnInsert: { coinId: id, name, symbol, image, atl_date: new Date(atl_date) } },
        { upsert: true }
      );
    }

    return statusOutputSuccess;
  },
};
