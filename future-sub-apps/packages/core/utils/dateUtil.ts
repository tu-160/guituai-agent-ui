/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import { getDateFormat } from '@/utils/future';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export type FormatDate = dayjs.ConfigType;

export function formatToDateTime(date: dayjs.ConfigType = undefined, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(getDateFormat(format));
}

export function formatToDate(date: dayjs.ConfigType = undefined, format = DATE_FORMAT): string {
  return dayjs(date).format(getDateFormat(format));
}

export const dateUtil = dayjs;
