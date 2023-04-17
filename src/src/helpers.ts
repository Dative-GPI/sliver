import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

import am5locales_en_US from "@amcharts/amcharts5/locales/en_US";
import am5locales_fr_FR from "@amcharts/amcharts5/locales/fr_FR";
import am5locales_it_IT from "@amcharts/amcharts5/locales/it_IT";
import am5locales_es_ES from "@amcharts/amcharts5/locales/es_ES";
import am5locales_de_DE from "@amcharts/amcharts5/locales/de_DE";
import am5locales_pt_PT from "@amcharts/amcharts5/locales/pt_PT";

export const updateCategories = (formers: any[], data: any[], categoryField: string, categoryCodeField: string, openValueField: string | null, valueField: string, serieId: number, sort: boolean): any[] => {
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
        return -1;
      }
      else if (c1[categoryField] > c2[categoryField]) {
        return 1;
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
    case "utc-11:00:00": return am5.Timezone.new("Pacific/Niue");
    case "utc-10:00:00": return am5.Timezone.new("Pacific/Tahiti");
    case "utc-09:00:00": return am5.Timezone.new("Pacific/Gambier");
    case "utc-08:00:00": return am5.Timezone.new("Pacific/Pitcairn");
    case "utc-07:00:00": return am5.Timezone.new("America/Phoenix");
    case "utc-06:00:00": return am5.Timezone.new("America/Costa_Rica");
    case "utc-05:00:00": return am5.Timezone.new("America/Cancun");
    case "utc-04:00:00": return am5.Timezone.new("America/Caracas");
    case "utc-03:00:00": return am5.Timezone.new("America/Araguaina");
    case "utc-02:00:00": return am5.Timezone.new("America/Noronha");
    case "utc-01:00:00": return am5.Timezone.new("Atlantic/Cape_Verde");
    case "utc+01:00:00": return am5.Timezone.new("Africa/Tunis");
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

export const formatNumber = (value: number, locale: string, decimalPlaces: number): string => {
  if (isNaN(value)) {
    return value.toString();
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: decimalPlaces }).format(value);
}

export const isEmptyString = (value: string | undefined): boolean => {
  return (value == null || value === "" || /^\s*$/.test(value));
}

export const setLineSerieBullets = (serie: am5.Series): void => {
  serie.bullets.clear();

  if (!serie.get("userData").showBullets && !serie.get("userData").showTooltipBullet) {
    return;
  }
  else if (serie.get("userData").showBullets) {
    serie.bullets.push((root) => {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          opacity: serie.get("opacity"),
          radius: serie.get("userData").bulletRadius,
          fill: serie.get("fill")
        })
      })
    });
  }
  else if (serie.get("userData").showTooltipBullet && serie.get("tooltip") != null) {
    serie.bullets.push((root, _, dataItem) => {
      if (dataItem == serie.dataItems[serie.dataItems.length - 1]) {
        serie.set("userData", { ...serie.get("userData"), tooltipBullet: am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
              opacity: serie.get("opacity"),
              radius: serie.get("userData").bulletRadius,
              fill: serie.get("fill")
            })
          })
        });
        return serie.get("userData").tooltipBullet;
      }
    });
    serie.get("tooltip")!.events.off("dataitemchanged");
    serie.get("tooltip")!.events.on("dataitemchanged", (event) => {
      if (event.newDataItem != null && event.oldDataItem != null) {
        event.newDataItem.bullets = [serie.get("userData").tooltipBullet];
        serie.get("userData").tooltipBullet.get("sprite").dataItem = event.newDataItem;
        serie.data.push({});
        serie.data.pop();
      }
    });
  }
}

export const setRangeSerieBullets = (serie: am5.Series): void => {
  serie.bullets.clear();

  if (!serie.get("userData").showBullets && !serie.get("userData").showTooltipBullet) {
    return;
  }
  else if (serie.get("userData").showBullets) {
    serie.bullets.push((root) => {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          opacity: serie.get("opacity"),
          radius: serie.get("userData").bulletRadius,
          fill: serie.get("fill")
        })
      })
    });
  }
  else if (serie.get("userData").showTooltipBullet && serie.get("tooltip") != null) {
    serie.bullets.push((root, _, dataItem) => {
      if (dataItem == serie.dataItems[serie.dataItems.length - 1]) {
        serie.set("userData", { ...serie.get("userData"), tooltipBullet: am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
              opacity: serie.get("opacity"),
              radius: serie.get("userData").bulletRadius,
              fill: serie.get("fill")
            })
          })
        });
        return serie.get("userData").tooltipBullet;
      }
    });
    serie.get("tooltip")!.events.off("dataitemchanged");
    serie.get("tooltip")!.events.on("dataitemchanged", (event) => {
      if (event.newDataItem != null && event.oldDataItem != null) {
        event.newDataItem.bullets = [serie.get("userData").tooltipBullet];
        serie.get("userData").tooltipBullet.get("sprite").dataItem = event.newDataItem;
        serie.data.push({});
        serie.data.pop();
      }
    });
  }
}

export const setStepLineSerieBullets = (serie: am5.Series): void => {
  serie.bullets.clear();

  if (!serie.get("userData").showBullets && !serie.get("userData").showTooltipBullet) {
    return;
  }
  else if (serie.get("userData").showBullets) {
    serie.bullets.push((root) => {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          opacity: serie.get("opacity"),
          radius: serie.get("userData").bulletRadius,
          fill: serie.get("fill")
        })
      })
    });
  }
  else if (serie.get("userData").showTooltipBullet && serie.get("tooltip") != null) {
    serie.bullets.push((root, _, dataItem) => {
      if (dataItem == serie.dataItems[serie.dataItems.length - 1]) {
        serie.set("userData", { ...serie.get("userData"), tooltipBullet: am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
              opacity: serie.get("opacity"),
              radius: serie.get("userData").bulletRadius,
              fill: serie.get("fill")
            })
          })
        });
        return serie.get("userData").tooltipBullet;
      }
    });
    serie.get("tooltip")!.events.off("dataitemchanged");
    serie.get("tooltip")!.events.on("dataitemchanged", (event) => {
      if (event.newDataItem != null && event.oldDataItem != null) {
        event.newDataItem.bullets = [serie.get("userData").tooltipBullet];
        serie.get("userData").tooltipBullet.get("sprite").dataItem = event.newDataItem;
        serie.data.push({});
        serie.data.pop();
      }
    });
  }
}

export const setScatterPlotSerieBullets = (serie: am5.Series, root: am5.Root): void => {
  serie.bullets.clear();

  if (serie.get("userData").showTooltip) {
    let tooltip = am5.Tooltip.new(root, {
      autoTextColor: false
    });
    tooltip.label.set("fill", textColor(serie.get("fill")!.toCSSHex()));
    tooltip.get("background")!.set("fillOpacity", 0.50);

    serie.bullets.push(() => {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          tooltip: tooltip,
          tooltipText: serie.get("userData").tooltipText,
          opacity: serie.get("opacity"),
          fill: serie.get("fill")
        }, serie.get("userData").circleTemplate)
      });
    });
  }
  else {
    serie.bullets.push(() => {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          opacity: serie.get("opacity"),
          fill: serie.get("fill")
        }, serie.get("userData").circleTemplate)
      });
    });
  }
}