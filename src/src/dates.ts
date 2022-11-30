import { format } from "date-fns";
import { enUS, enGB, fr, it, es, ru, de } from "date-fns/locale";

export const DateTools =  {
  formatShortEpoch: (locale: string, offset: string, epoch: number): string => {
    return InnerDateTools.formatEpoch(locale, ShortTimeFormat(locale), epoch - (getTimeZoneOffsetMinutes(offset) * 60 * 1000));
  }
}

const InnerDateTools = {
  formatEpoch: (locale: string, dateFormat: string, epoch: number): string => {
    try {
      return format(epoch, dateFormat, { locale: getLocale(locale) });
    }
    catch {
      return "";
    }
  }
}

const ShortTimeFormat = (locale: string): string => {
  switch (locale) {
    case "fr-FR": return "dd/MM/yy HH:mm:ss";
    case "es-ES": return "dd/MM/yy HH:mm:ss";
    case "it-IT": return "dd/MM/yy HH:mm:ss";
    case "en-GB": return "dd/MM/yy HH:mm:ss";
    case "de-DE": return "dd/MM/yy HH:mm:ss";
    case "ru-RU": return "dd/MM/yy HH:mm:ss";
    default: return "MM/dd/yy HH:mm:ss";
  }  
}

const getTimeZoneOffsetMinutes = (offset: string): number => {
  let cleaned = offset.replaceAll(" ", "").toLowerCase();
  switch (cleaned) {
    case "utc-11:00:00": return -11 * 60;
    case "utc-10:00:00": return -10 * 60;
    case "utc-09:00:00": return -9 * 60;
    case "utc-08:00:00": return -8 * 60;
    case "utc-07:00:00": return -7 * 60;
    case "utc-06:00:00": return -6 * 60;
    case "utc-05:00:00": return -5 * 60;
    case "utc-04:00:00": return -4 * 60;
    case "utc-03:00:00": return -3 * 60;
    case "utc-02:00:00": return -2 * 60;
    case "utc-01:00:00": return -1 * 60;
    case "utc+01:00:00": return +1 * 60;
    case "utc+02:00:00": return +2 * 60;
    case "utc+03:00:00": return +3 * 60;
    case "utc+04:00:00": return +4 * 60;
    case "utc+05:00:00": return +5 * 60;
    case "utc+06:00:00": return +6 * 60;
    case "utc+07:00:00": return +7 * 60;
    case "utc+08:00:00": return +8 * 60;
    case "utc+09:00:00": return +9 * 60;
    case "utc+10:00:00": return +10 * 60;
    case "utc+11:00:00": return +11 * 60;
    case "utc+12:00:00": return +12 * 60;
    case "utc+13:00:00": return +13 * 60;
    case "utc+14:00:00": return +14 * 60;
    default: return 0;
  }
}

const getLocale = (locale: string): Locale => {
  switch (locale) {
    case "fr-FR": return fr;
    case "es-ES": return es;
    case "it-IT": return it;
    case "en-GB": return enGB;
    case "de-DE": return de;
    case "ru-RU": return ru;
    default: return enUS;
  }
}