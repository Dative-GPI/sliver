import * as am5 from "@amcharts/amcharts5";

import am5locales_en from "@amcharts/amcharts5/locales/en";
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
    formers.sort((a, b) => alphaNumericalOrder(a[categoryField], b[categoryField]));
  }
  return formers;
}

export const alphaNumericalOrder = (x: string, y: string): number => {
  if (x == null || y == null) {
    return 0;
  }
  
  let indexX: number = 0;
  let indexY: number = 0;

  while (indexX < x.length && indexY < y.length)
  {
    let loc1: number = 0;
    let ch1: string = x[indexX];
    let space1: string[] = new Array(x.length);

    let loc2: number = 0;
    let ch2: string = y[indexY];
    let space2: string[] = new Array(y.length);

    do {
      space1[loc1++] = ch1;
      indexX++;

      if (indexX < x.length) {
          ch1 = x[indexX];
      }
      else {
          break;
      }
    } while (!isNaN(parseInt(ch1)) == !isNaN(parseInt(space1[0])));

    do {
      space2[loc2++] = ch2;
      indexY++;

      if (indexY < y.length) {
          ch2 = y[indexY];
      }
      else {
          break;
      }
    } while (!isNaN(parseInt(ch2)) == !isNaN(parseInt(space2[0])));

    let str1: string = space1.join('');
    let str2: string = space2.join('');

    let result: number = 0;

    if (!isNaN(parseInt(space1[0])) && !isNaN(parseInt(space2[0]))) {
      result = (parseInt(str1) < parseInt(str2)) ? -1 : 1;
    }
    else if (str1 !== str2) {
      result = str1 < str2 ? -1 : 1;
    }
    if (result != 0) {
      return result;
    }
  }
  return x.length - y.length;
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

export const uuidv4 = (): string => {
  return (([1e7] as any)+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: any) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export const getLocale = (code: string): any => {
  switch (code) {
    case "en-UK": {
      return am5locales_en;
    }
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

  if (serie.get("userData").showBullets) {
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
}

export const setRangeSerieBullets = (serie: am5.Series): void => {
  serie.bullets.clear();

  if (serie.get("userData").showBullets) {
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
}

export const setStepLineSerieBullets = (serie: am5.Series): void => {
  serie.bullets.clear();

  if (serie.get("userData").showBullets) {
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