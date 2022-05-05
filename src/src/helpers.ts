import * as am5 from "@amcharts/amcharts5";

export const updateCategories = (former: any[], data: any[], categoryField: string, serieId: number, sort: boolean, xAxis: boolean): any[] => {
  for (let i = 0; i < former.length; i++) {
    former[i].series = former[i].series.filter((s: number) => s !== serieId);
  }
  former = former.filter(c => c.series.length > 0);

  for (let i = 0; i < data.length; i++) {
    if (former.filter(c => c[categoryField] == data[i][categoryField]).length === 0) {
      former.push({ [categoryField]: data[i][categoryField], series: [serieId] });
    }
    else if (!former.filter(c => c[categoryField] == data[i][categoryField])[0].series.includes(serieId)) {
      former.filter(c => c[categoryField] == data[i][categoryField])[0].series.push(serieId);
    }
  }
  if (sort) {
    former.sort((c1: any, c2: any) => {
      if (c1[categoryField] < c2[categoryField]) return xAxis ? -1 : 1;
      if (c1[categoryField] > c2[categoryField]) return xAxis ? 1 : -1;
      return 0;
    });
  }
  return former;
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

    if (Math.max(r, g, b) < 127) {
      return am5.color(0xffffff);
    }
    else if (Math.max(r, g) < 127) {
      return am5.color(0xffffff);
    }
    else if (Math.max(g, b) < 127) {
      return am5.color(0xffffff);
    }
  }
  return am5.color(0x000000);
}