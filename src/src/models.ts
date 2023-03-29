export interface IconLine {
  value: number;
  color: string;
  tooltip: string[];
  icon: string;
}

export interface ValueRange {
  startValue: number;
  endValue: number;
  color: string;
  opacity: number;
  label?: string;
}

export interface TimeRange {
  startDay: Days;
  startHour: number;
  startMinute: number;
  endDay: Days;
  endHour: number;
  endMinute: number;
  color: string;
  opacity: number;
  label?: string;
}

export enum Days {
  Monday    = 0,
  Tuesday   = 1,
  Wednesday = 2,
  Thursday  = 3,
  Friday    = 4,
  Saturday  = 5,
  Sunday    = 6,
  AllDays   = 7
}

export enum ChartType {
  None      = 0,
  XY        = 1,
  Pie       = 2,
  Heatmap   = 3,
  Indicator = 4,
  Radar     = 5,
  ScoreCard = 6,
  Table     = 7
}

export enum AxisType {
  None     = 0,
  Date     = 1,
  Value    = 2,
  Category = 3
}

export enum SerieType {
  None        = 0,
  Lines       = 1,
  Area        = 2,
  Range       = 3,
  Histogram   = 4,
  Operation   = 5,
  Planning    = 6,
  ScatterPlot = 7,
  Top         = 8,
  Bars        = 9,
  StackedBars = 10,
  Pie         = 11,
  Heatmap     = 12,
  Indicator   = 13,
  Radar       = 14,
  ScoreCard   = 15,
  Table       = 16
}

export interface ChartData {
  chartType: ChartType;
  xAxisType: AxisType;
  plots: ChartDataPlot[];
};

export interface ChartDataPlot {
  yAxisType: AxisType;
  series: ChartDataSerie[];
}

export interface ChartDataSerie {
  serieType: SerieType;
  operands: ChartDataOperand[];
}

export interface ChartDataOperand {
  label: string;
  data: ChartDataData[];
  subOperands: ChartDataOperand[];
}

export interface ChartDataData {
  categoryX?: string;
  categoryY?: string;
  valueX?: number;
  closeValueX?: number;
  selfValueX?: number;
  valueY?: number;
  valueZ?: number;
  timestampX?: number;
  closeTimestampX?: number;
  subs?: ChartDataSub[];
}

export interface ChartDataSub {
  categoryX?: string;
  valueY?: number;  
}

export enum DataTable {
  None   = 0,
  Number = 1,
  String = 2
}

export interface TableData {
  headers: { label: string, dataTable: DataTable }[];
  rows: TableDataRow[];
}

export interface TableDataRow {
  timestamp: number;
  entity: string;
  values: string[];
}

export interface ScoreCardSerie {
  icon: string,
  iconSize: string,
  decimalPlaces: number,
  heatRule: number,
  minColor: string,
  minValue?: number,
  maxColor: string,
  maxValue?: number,
  heatRanges: {
    startValue: number,
    endValue: number,
    color: string,
    opacity: number
  }[],
  fixedColor: string,
  operationUnit: string
}