import { RouteOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import fetch from 'node-fetch';
import { ICoinsMarketsResponse } from '../../shared/coin-gecko';
import { coinGeckoConfig } from '../../shared/configs';
import { CoinListEntity } from '../../shared/database';
import { statusOutputSuccess } from '../../shared/view-models';
import { IUpdateCoinListQueryInput, UpdateCoinListSchema } from './schemas';

type RouteCustomOptions = RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  { Body: unknown; Querystring: IUpdateCoinListQueryInput }
>;

export const updateCoinListRoute: RouteCustomOptions = {
  url: '/update',
  method: 'POST',
  schema: UpdateCoinListSchema,
  handler: async (req, reply) => {
    const { page, per_page } = req.query;

    const res = await fetch(
      `${coinGeckoConfig.url}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=false`
    );

    const data: ICoinsMarketsResponse[] = await res.json();

    for (const { id, name, symbol, image, atl_date } of data) {
      await CoinListEntity.create({ coinId: id, name, symbol, image, atl_date }).save();
    }

    return statusOutputSuccess;
  },
};