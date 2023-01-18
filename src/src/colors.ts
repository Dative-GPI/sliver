import * as am5 from "@amcharts/amcharts5";

export enum ColorSets {
  Default = 0,
  Grafana = 1,
  Kelly = 2,
  Armytage = 3,
  ZeileisHornikMurrell = 4,
  Hash = 5
}

const AmChartsSet: string[] = [
  "#67b7dc",
  "#6794dc",
  "#6771dc",
  "#8067dc",
  "#a367dc",
  "#c767dc",
  "#dc67ce",
  "#dc67ab",
  "#dc6788",
  "#dc6967",
  "#dc8c67",
  "#dcaf67",
  "#dcd267",
  "#c3dc67",
  "#a0dc67",
  "#7ddc67",
  "#67dc75",
  "#67dc98",
  "#67dcbb",
  "#67dadc",
  "#c667dc",
  "#7cdc67"
];

const GrafanaSet: string[] = [
  "#7EB26D",
  "#EAB839",
  "#6ED0E0",
  "#EF843C",
  "#E24D42",
  "#1F78C1",
  "#BA43A9",
  "#705DA0",
  "#508642",
  "#CCA300",
  "#447EBC",
  "#C15C17",
  "#890F02",
  "#0A437C",
  "#6D1F62",
  "#584477",
  "#B7DBAB",
  "#F4D598",
  "#70DBED",
  "#F9BA8F",
  "#F29191",
  "#82B5D8",
  "#E5A8E2",
  "#AEA2E0",
  "#629E51",
  "#E5AC0E",
  "#64B0C8",
  "#E0752D",
  "#BF1B00",
  "#0A50A1",
  "#962D82",
  "#614D93",
  "#9AC48A",
  "#F2C96D",
  "#65C5DB",
  "#F9934E",
  "#EA6460",
  "#5195CE",
  "#D683CE",
  "#806EB7",
  "#3F6833",
  "#967302",
  "#2F575E",
  "#99440A",
  "#58140C",
  "#052B51",
  "#511749",
  "#3F2B5B",
  "#E0F9D7",
  "#FCEACA",
  "#CFFAFF",
  "#F9E2D2",
  "#FCE2DE",
  "#BADFF4",
  "#F9D9F9",
  "#DEDAF7"
];

const KellySet: string[] = [
  "#f1bf15",
  "#9352a8",
  "#f7760b",
  "#99c6f9",
  "#d51c3c",
  "#c8b18b",
  "#8a8489",
  "#23eaa5",
  "#f483cd",
  "#276cbd",
  "#f59080",
  "#61419c",
  "#f6a600",
  "#b83773",
  "#ebdd21",
  "#8b1c0e",
  "#a7dc26",
  "#673f0b",
  "#e83b1b",
  "#20340b",
  "#2b292b"
];

const ArmytageSet: string[] = [
  "#f0a3ff",
  "#0075dc",
  "#993f00",
  "#4c005c",
  "#191919",
  "#005c31",
  "#2bce48",
  "#ffcc99",
  "#808080",
  "#94ffb5",
  "#8f7c00",
  "#9dcc00",
  "#c20088",
  "#003380",
  "#ffa405",
  "#ffa8bb",
  "#426600",
  "#ff0010",
  "#5ef1f2",
  "#00998f",
  "#e0ff66",
  "#740aff",
  "#990000",
  "#ffff00",
  "#ff5005"
];

const ZeileisHornikMurrellSet: string[] = [
  "#023fa5",
  "#7d87b9",
  "#bec1d4",
  "#d6bcc0",
  "#bb7784",
  "#8e063b",
  "#4a6fe3",
  "#8595e1",
  "#b5bbe3",
  "#e6afb9",
  "#e07b91",
  "#d33f6a",
  "#11c638",
  "#8dd593",
  "#c6dec7",
  "#ead3c6",
  "#f0b98d",
  "#ef9708",
  "#0fcfc0",
  "#9cded6",
  "#d5eae7",
  "#f3e1eb",
  "#f6c4e1",
  "#f79cd4"
];

export const GetColors = (set: ColorSets): am5.Color[] => {
  switch (set) {
    case ColorSets.Grafana: return GrafanaSet.map(c => am5.color(c));
    case ColorSets.Kelly: return KellySet.map(c => am5.color(c));
    case ColorSets.Armytage: return ArmytageSet.map(c => am5.color(c));
    case ColorSets.ZeileisHornikMurrell: return ZeileisHornikMurrellSet.map(c => am5.color(c));
    default: return AmChartsSet.map(c => am5.color(c));
  }
}

export const GetHashedColor = (seed: string, label: string): am5.Color => {
  let hash = unsecureHash(label + unsecureHash(seed));
  let r = 0, g = 0, b = 0;
  r = hash % 255;
  hash = Math.ceil(hash * 359);
  g = hash % 255;
  hash = Math.ceil(hash * 7789);
  b = hash % 255
  return am5.color(`#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`);
}

const unsecureHash = (value: string): number => {
  let a = 1, c = 0;
  if (value) {
    a = 0;
    for (let h = 0; h < value.length; h++) {
      a = (a << 6&268435455) + value.charCodeAt(h) + (value.charCodeAt(h) << 14);
      c = a & 266338304;
      a = c !== 0 ? a ^ c >> 21 : a;
    }
  }
  return a * 479001599;
}