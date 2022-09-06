import * as am5 from "@amcharts/amcharts5";

import am5locales_en_US from "@amcharts/amcharts5/locales/en_US";
import am5locales_fr_FR from "@amcharts/amcharts5/locales/fr_FR";
import am5locales_it_IT from "@amcharts/amcharts5/locales/it_IT";
import am5locales_es_ES from "@amcharts/amcharts5/locales/es_ES";
import am5locales_de_DE from "@amcharts/amcharts5/locales/de_DE";
import am5locales_pt_PT from "@amcharts/amcharts5/locales/pt_PT";

import { PositionEnum } from "./enums";

export const updateCategories = (formers: any[], data: any[], categoryField: string, categoryCodeField: string, openValueField: string | null, valueField: string, serieId: number, sort: boolean, position: PositionEnum): any[] => {
  for (let i = 0; i < formers.length; i++) {
    let serieIndex = formers[i].series.indexOf(serieId);
    while (serieIndex !== -1) {
      formers[i].series.splice(serieIndex, 1);
      formers[i].values.splice(serieIndex, 1);
      serieIndex = formers[i].series.indexOf(serieId, serieIndex + 1);
    }
  }
  formers = formers.filter(former => former.series.length > 0);

  for (let i = 0; i < data.length; i++) {
    let item = formers.find(former => former[categoryCodeField] == data[i][categoryCodeField]);
    if (item == null) {
      let notEmpty = (data[i][categoryField] == null || data[i][categoryField].match(/^ *$/) !== null) ?
        " " : data[i][categoryField];
      formers.push({
        [categoryField]: notEmpty,
        [categoryCodeField]: data[i][categoryCodeField],
        series: [serieId],
        values: openValueField == null ? [data[i][valueField]] : [(data[i][valueField] as number) - data[i][openValueField]]
      });
    }
    else if (!item.series.includes(serieId)) {
      item.series.push(serieId);
      item.values.push(openValueField == null ? data[i][valueField] : data[i][valueField] - data[i][openValueField]);
    }
  }

  if (sort) {
    formers.sort((c1: any, c2: any) => {
      if (c1[categoryField] < c2[categoryField]) {
        switch (position) {
          case PositionEnum.Abscissa: return -1;
          case PositionEnum.Ordinate: return 1;
        }
      }
      else if (c1[categoryField] > c2[categoryField]) {
        switch (position) {
          case PositionEnum.Abscissa: return 1;
          case PositionEnum.Ordinate: return -1;
        }
      }
      return 0;
    });
  }
  return formers;
}

export const sortValues = (former: any[]): any[] => {
  let test =  former.slice().sort((a: any, b: any) => {
    if (
      a.values.reduce((value: any, current: any) => parseFloat(value) + parseFloat(current), 0) >
      b.values.reduce((value: any, current: any) => parseFloat(value) + parseFloat(current), 0)
    ) return 1;
    else return -1;
  });
  return test;
}

export const addSerie = (former: any[], serie: any): any[] => {
  former.push(serie);
  return former;
}

export const removeSerie = (former: any[], serie: any): any[] => {
  former.splice(former.indexOf(serie), 1);
  return former;
}

export const textColor = (backgroundHexColor: string): am5.Color => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(backgroundHexColor);
  if (result != null) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    if (Math.max(r, g, b) < 132) {
      return am5.color("#ffffff");
    }
    else if (Math.max(r, g) < 132) {
      return am5.color("#ffffff");
    }
    else if (Math.max(g, b) < 132) {
      return am5.color("#ffffff");
    }
  }
  return am5.color("#000000");
}

export const getLineIntersection = (a1: { x: number, y: number }, a2: { x: number, y: number }, b1: { x: number, y: number }, b2: { x: number, y: number }): { x: number, y: number } => {
  let x = ((a1.x * a2.y - a2.x * a1.y) * (b1.x - b2.x) - (a1.x - a2.x) * (b1.x * b2.y - b1.y * b2.x)) / ((a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x));
  let y = ((a1.x * a2.y - a2.x * a1.y) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x * b2.y - b1.y * b2.x)) / ((a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x));
  return { x: x, y: y };
}

export const uuidv4 = (): string => {
  return (([1e7] as any)+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export const getLocale = (code: string): any => {
  switch (code) {
    case "en-UK":
    case "en-US": {
      return am5locales_en_US;
    }
    case "fr-FR": {
      return am5locales_fr_FR;
    }
    case "it-IT": {
      return am5locales_it_IT;
    }
    case "es-ES": {
      return am5locales_es_ES;
    }
    case "de-DE": {
      return am5locales_de_DE;
    }
    case "pt-PT": {
      return am5locales_pt_PT;
    }
    default: {
      return am5locales_en_US;
    }
  }
}

export const getTimezone = (timeOffset: string): am5.Timezone  => {
  let cleaned = timeOffset.replaceAll(" ", "").toLowerCase();
  switch (cleaned) {
    case "utc-11:00:00": return am5.Timezone.new("Pacific/Samoa");
    case "utc-10:00:00": return am5.Timezone.new("Pacific/Honolulu");
    case "utc-09:00:00": return am5.Timezone.new("Pacific/Gambier");
    case "utc-08:00:00": return am5.Timezone.new("Pacific/Pitcairn");
    case "utc-07:00:00": return am5.Timezone.new("America/Phoenix");
    case "utc-06:00:00": return am5.Timezone.new("America/Costa_Rica");
    case "utc-05:00:00": return am5.Timezone.new("America/Cancun");
    case "utc-04:00:00": return am5.Timezone.new("America/Antigua");
    case "utc-03:00:00": return am5.Timezone.new("America/Araguaina");
    case "utc-02:00:00": return am5.Timezone.new("America/Noronha");
    case "utc-01:00:00": return am5.Timezone.new("Atlantic/Cape_Verde");
    case "utc+01:00:00": return am5.Timezone.new("Europe/Paris");
    case "utc+02:00:00": return am5.Timezone.new("Africa/Cairo");
    case "utc+03:00:00": return am5.Timezone.new("Africa/Djibouti");
    case "utc+04:00:00": return am5.Timezone.new("Asia/Dubai");
    case "utc+05:00:00": return am5.Timezone.new("Asia/Karachi");
    case "utc+06:00:00": return am5.Timezone.new("Asia/Dhaka");
    case "utc+07:00:00": return am5.Timezone.new("Asia/Jakarta");
    case "utc+08:00:00": return am5.Timezone.new("Asia/Brunei");
    case "utc+09:00:00": return am5.Timezone.new("Asia/Seoul");
    case "utc+10:00:00": return am5.Timezone.new("Asia/Vladivostok");
    case "utc+11:00:00": return am5.Timezone.new("Pacific/Bougainville");
    case "utc+12:00:00": return am5.Timezone.new("Asia/Kamchatka");
    case "utc+13:00:00": return am5.Timezone.new("Pacific/Apia");
    case "utc+14:00:00": return am5.Timezone.new("Pacific/Kiritimati");
    default: return am5.Timezone.new("UTC");
  }
}

export interface AxisRange {
  startValue: number;
  endValue: number;
  color: string;
  opacity: number;
  label?: string;
}

export interface TimeRange {
  startDay: number;
  startHour: number;
  startMinute: number;
  endDay: number;
  endHour: number;
  endMinute: number;
  color: string;
  opacity: number;
  label?: string;
}