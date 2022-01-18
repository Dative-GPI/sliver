export const updateCategories = (former: any[], data: any[], categoryField: string): any[] => {
  for (let i = 0; i < data.length; i++) {
    if (former.filter(c => c[categoryField] == data[i][categoryField]).length == 0) {
      former.push({ [categoryField]: data[i][categoryField] });
    }
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

export const textColor = (backgroundHexColor: string): string => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(backgroundHexColor);
  if (result != null) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    if (Math.max(r, g, b) < 127) {
      return "#ffffff";
    }
    else if (Math.max(r, g) < 127) {
      return "#ffffff";
    }
    else if (Math.max(g, b) < 127) {
      return "#ffffff";
    }
  }
  return "#000000";
}