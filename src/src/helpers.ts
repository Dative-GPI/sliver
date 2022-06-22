import * as am5 from "@amcharts/amcharts5";

import { PositionEnum } from "./enums";

export const updateCategories = (former: any[], data: any[], categoryField: string, serieId: number, sort: boolean, position: PositionEnum): any[] => {
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
      return am5.color("#ffffff");
    }
    else if (Math.max(r, g) < 127) {
      return am5.color("#ffffff");
    }
    else if (Math.max(g, b) < 127) {
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

export interface AxisRange {
  startValue: number;
  endValue: number;
  color: string;
  opacity: number;
  label?: string;
}