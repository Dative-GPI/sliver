import { format } from "date-fns";
import { enUS, enGB, fr, it, es, ru, de } from "date-fns/locale";

import * as am5 from "@amcharts/amcharts5";

export const getTimezone = (timeOffset: string): am5.Timezone  => {
  let cleaned = timeOffset.replaceAll(" ", "").toLowerCase();
  switch (cleaned) {
    case "utc-11:00:00": return am5.Timezone.new("Etc/GMT+11");
    case "utc-10:00:00": return am5.Timezone.new("Etc/GMT+10");
    case "utc-09:00:00": return am5.Timezone.new("Etc/GMT+9");
    case "utc-08:00:00": return am5.Timezone.new("Etc/GMT+8");
    case "utc-07:00:00": return am5.Timezone.new("Etc/GMT+7");
    case "utc-06:00:00": return am5.Timezone.new("Etc/GMT+6");
    case "utc-05:00:00": return am5.Timezone.new("Etc/GMT+5");
    case "utc-04:00:00": return am5.Timezone.new("Etc/GMT+4");
    case "utc-03:00:00": return am5.Timezone.new("Etc/GMT+3");
    case "utc-02:00:00": return am5.Timezone.new("Etc/GMT+2");
    case "utc-01:00:00": return am5.Timezone.new("Etc/GMT+1");
    case "utc+01:00:00": return am5.Timezone.new("Etc/GMT-1");
    case "utc+02:00:00": return am5.Timezone.new("Etc/GMT-2");
    case "utc+03:00:00": return am5.Timezone.new("Etc/GMT-3");
    case "utc+04:00:00": return am5.Timezone.new("Etc/GMT-4");
    case "utc+05:00:00": return am5.Timezone.new("Etc/GMT-5");
    case "utc+06:00:00": return am5.Timezone.new("Etc/GMT-6");
    case "utc+07:00:00": return am5.Timezone.new("Etc/GMT-7");
    case "utc+08:00:00": return am5.Timezone.new("Etc/GMT-8");
    case "utc+09:00:00": return am5.Timezone.new("Etc/GMT-9");
    case "utc+10:00:00": return am5.Timezone.new("Etc/GMT-10");
    case "utc+11:00:00": return am5.Timezone.new("Etc/GMT-11");
    case "utc+12:00:00": return am5.Timezone.new("Etc/GMT-12");
    case "utc+13:00:00": return am5.Timezone.new("Etc/GMT-13");
    case "utc+14:00:00": return am5.Timezone.new("Etc/GMT-14");
    default: return am5.Timezone.new("UTC");
  }
}

export const getUserOffset = (offset: string, milliseconds: boolean = false): number => {
  let userOffset = 0;
  let cleaned = offset.replaceAll(" ", "").toLowerCase();
  switch (cleaned) {
    case "utc-11:00:00": userOffset = -11; break;
    case "utc-10:00:00": userOffset = -10; break;
    case "utc-09:00:00": userOffset = -9; break;
    case "utc-08:00:00": userOffset = -8; break;
    case "utc-07:00:00": userOffset = -7; break;
    case "utc-06:00:00": userOffset = -6; break;
    case "utc-05:00:00": userOffset = -5; break;
    case "utc-04:00:00": userOffset = -4; break;
    case "utc-03:00:00": userOffset = -3; break;
    case "utc-02:00:00": userOffset = -2; break;
    case "utc-01:00:00": userOffset = -1; break;
    case "utc+01:00:00": userOffset = +1; break;
    case "utc+02:00:00": userOffset = +2; break;
    case "utc+03:00:00": userOffset = +3; break;
    case "utc+04:00:00": userOffset = +4; break;
    case "utc+05:00:00": userOffset = +5; break;
    case "utc+06:00:00": userOffset = +6; break;
    case "utc+07:00:00": userOffset = +7; break;
    case "utc+08:00:00": userOffset = +8; break;
    case "utc+09:00:00": userOffset = +9; break;
    case "utc+10:00:00": userOffset = +10; break;
    case "utc+11:00:00": userOffset = +11; break;
    case "utc+12:00:00": userOffset = +12; break;
    case "utc+13:00:00": userOffset = +13; break;
    case "utc+14:00:00": userOffset = +14; break;
  }
  if (milliseconds) {
    return userOffset * 60 * 60 * 1000;
  }
  return userOffset;
}

export const getMachineOffset = (milliseconds: boolean = false): number => {
  if (milliseconds) {
    return -(new Date()).getTimezoneOffset() * 60 * 1000;
  }
  return -(new Date()).getTimezoneOffset() / 60;
}

export const LongTimeFormat =  "EEE dd LLL yyyy HH:mm:ss";

export const DateTools =  {
  formatShortEpoch: (locale: string, offset: string, epoch: number): string => {
    return InnerDateTools.formatEpoch(locale, ShortTimeFormat(locale), epoch + getUserOffset(offset, true));
  },
  formatLongTimeEpoch: (locale: string, offset: string, epoch: number): string => {
    const result = InnerDateTools.formatEpoch(locale, LongTimeFormat, epoch + getUserOffset(offset, true));
    return capitalizeFirstLetter(result);
  },
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

function capitalizeFirstLetter(data: string) {
  return data.charAt(0).toUpperCase() + data.slice(1);
}