import { ICoinInfo } from './crypto.type';

export interface ICoinShareData {
  coinId: string;
  share: number;
}

export interface ICoinsPrices {
  [key: string]: number[];
}

export interface ICoinsCapitals {
  [key: string]: number[];
}

export interface ICoinMainData extends ICoinInfo {
  share: number;
  prices: number[];
}

export interface ICoinProfitResult extends ICoinInfo {
  startingPrice: number;
  averagePrice: number;
  lastPrice: number;
  invested: number;
  capital: number;
  purchasedCoins: number;
  growth: number;
  share: number;
}

export interface IMonthlyCapitalData {
  date: number;
  capital: number;
}
